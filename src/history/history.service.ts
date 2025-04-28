import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, IsNull, Repository } from 'typeorm';

import { CreateNotificationDTO } from 'src/notifications/dto/notification.dto';
import { NotificationService } from 'src/notifications/notification.service';
import { Coordinate } from 'src/route/entities/route.entity';
import { UserService } from 'src/user/user.service';
import { DouglasPeuckerService } from './douglas-peucker.service';
import { HistoryApprovalDTO } from './dto/history-approval.dto';
import { CreateHistoryDTO, UpdateHistoryDTO } from './dto/history.dto';
import { HistoryApproval } from './entities/history-approval.entity';
import { HistoryTrack } from './entities/history-track.entity';
import { History } from './entities/history.entity';
import {
  UnplannedStop,
  UnplannedStopType,
} from './entities/unplanned-stop.entity';
import { completeSelect } from './select-options';

const leftPad = (str: string, length: number, complete: string) => {
  let padded = str;

  while (padded.length < length) {
    padded = complete + padded;
  }

  return padded;
};

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(HistoryApproval)
    private readonly approvalRepository: Repository<HistoryApproval>,
    @InjectRepository(UnplannedStop)
    private readonly uStopRepository: Repository<UnplannedStop>,
    @InjectRepository(HistoryTrack)
    private readonly trackRepository: Repository<HistoryTrack>,

    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly peuckerService: DouglasPeuckerService,
  ) {}

  /**
   * Busca todos os históricos, com ou sem filtro por id de motorista
   * Se o ID for passado, traz apenas os históricos daquele motorista
   */
  async findAll(id?: number): Promise<History[]> {
    let where: FindOptionsWhere<History>;

    if (id != null) {
      where = { driver: { id: id } };
    }

    return this.historyRepository.find({
      select: completeSelect, // Define os campos selecionados
      where: where,
      relations: {
        driver: true,
        route: true,
        vehicle: true,
        approval: { approvedBy: true },
        unplannedStops: true,
        track: true,
      },
      order: {
        startedAt: 'DESC',
      },
    });
  }

  // Busca todos os históricos de uma determinada rota
  async findByRoute(id: number): Promise<History[]> {
    return this.historyRepository.find({
      select: completeSelect,
      where: { route: { id: id } },
      relations: {
        driver: true,
        route: true,
        vehicle: true,
        approval: { approvedBy: true },
        track: true,
      },
    });
  }

  async findByStatus(
    status: string,
    from?: Date,
    to?: Date,
  ): Promise<History[]> {
    const where: Record<string, any> = {};

    if (status === 'ongoing') {
      where.endedAt = IsNull();
    }

    if (from != null && to != null) {
      where.startedAt = Between(from, to);
    }

    return this.historyRepository.find({
      select: {
        route: {
          id: true,
          path: {
            origin: true,
            destination: true,
            stops: true,
          },
          status: true,
        },
        vehicle: {
          id: true,
          plate: true,
        },
        driver: {
          id: true,
          name: true,
          cnh: true,
        },
      },
      where: where,
      relations: {
        driver: true,
        route: true,
        vehicle: true,
        approval: { approvedBy: true },
        track: true,
      },
    });
  }

  // Busca um histórico específico pelo id
  async findOne(id: number): Promise<History> {
    const history = await this.historyRepository.findOne({
      where: { id },
      relations: {
        driver: true,
        vehicle: true,
        route: true,
        approval: { approvedBy: true },
        unplannedStops: true,
        track: true,
      },
    });

    if (!history) {
      throw new Error(`Histórico com id ${id} não encontrado.`);
    }

    const getFullUrl = (url?: string) => {
      if (url) {
        return process.env.GCS_URL + url;
      }

      return null;
    };

    history.imgOdometerInitial = getFullUrl(history.imgOdometerInitial);
    history.imgOdometerFinal = getFullUrl(history.imgOdometerFinal);
    history.track = this.peuckerService
      .douglasPeucker(
        history.track.map((track) => track.coordinate),
        50.0,
      )
      .map((coordinate) => ({ coordinate }) as HistoryTrack);

    return history;
  }

  // Cria um novo histórico no banco de dados
  async create(history: CreateHistoryDTO): Promise<History> {
    return this.historyRepository.save(history.toEntity());
  }

  // Atualiza um histórico exixtente
  // Após a atualização, busca novamente o histórico atualizado para retornar
  async update(history: UpdateHistoryDTO): Promise<History> {
    return this.historyRepository
      .update({ id: history.id }, history.toEntity())
      .then(async () => {
        const updatedHistory = await this.findOne(history.id);

        if (history.endedAt) {
          const notificationDto = new CreateNotificationDTO();

          notificationDto.link = `/routes/${updatedHistory.route.id}/history/${updatedHistory.id}`;
          notificationDto.message = `Rota ${leftPad(updatedHistory.route.id.toString(), 4, '0')} foi finalizada`;

          notificationDto.users = await this.userService
            .findManagers()
            .then((managers) => managers.map(({ id }) => id));

          this.notificationService.create(notificationDto).catch((e) => {
            new Logger(HistoryService.name).warn(
              `Could not create notifications for route: ${updatedHistory.id}. Reason: ${e.message}`,
            );
          });
        }

        return updatedHistory;
      });
  }

  // Atualiza o status de aprovação de um histórico
  // Cria um novo registro de aprovação e associa ao histórico
  async updateStatus(id: number, status: HistoryApprovalDTO): Promise<History> {
    const history = await this.historyRepository.findOne({ where: { id } });

    if (!history) {
      throw new Error('Histórico não encontrado');
    }

    // Cria uma nova entidade de aprovação
    const approval = new HistoryApproval();
    approval.status = status.status;
    approval.observation = status.observation;
    approval.date = status.date;
    approval.approvedBy = status.approvedBy.toEntity();

    // Salva a aprovação e atualiza o histórico com ela
    return this.approvalRepository.save(approval).then((approval) => {
      history.approval = approval;
      return this.historyRepository.save(history);
    });
  }

  // Busca todos os históricos de um motorista específico
  async findAllByDriverId(driverId: number): Promise<History[]> {
    return this.historyRepository.find({
      where: {
        driver: { id: driverId }, // Ou outra forma de busca relacionada à rota
      },
      relations: ['route', 'driver', 'vehicle'], // Certifique-se de incluir as relações necessárias
    });
  }

  async addUnplannedStop(
    id: number,
    coordinate: Coordinate,
    type: UnplannedStopType,
  ) {
    const entity = new UnplannedStop();
    entity.coordinates = coordinate;
    entity.type = type;
    entity.date = new Date();

    entity.history = new History();
    entity.history.id = id;

    return this.uStopRepository.save(entity);
  }

  async trackHistory(coordinate: Coordinate, history: number) {
    const entity = new HistoryTrack();
    entity.coordinate = coordinate;
    entity.history = new History();
    entity.history.id = history;

    return this.trackRepository.save(entity);
  }
}
