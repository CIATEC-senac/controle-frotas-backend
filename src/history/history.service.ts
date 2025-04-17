import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { HistoryDTO } from './dto/history.dto';
import { HistoryApprovalDTO } from './dto/history.approval.dto';
import { HistoryApproval } from './entities/history-approval.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(HistoryApproval)
    private readonly approvalRepository: Repository<HistoryApproval>,
  ) {}

  async findAll(id?: number): Promise<History[]> {
    const coordinate = { lat: true, lng: true };

    return this.historyRepository.find({
      select: {
        id: true,
        odometerInitial: true,
        odometerFinal: true,
        elapsedDistance: true,
        imgOdometerInitial: true,
        imgOdometerFinal: true,
        pathCoordinates: {
          origin: coordinate,
          destination: coordinate,
          stops: true,
        },
        path: { origin: true, destination: true, stops: true },
        startedAt: true,
        endedAt: true,
        route: {
          id: true,
          path: { origin: true, destination: true, stops: true },
          pathCoordinates: {
            origin: coordinate,
            destination: coordinate,
            stops: true,
          },
          estimatedDistance: true,
          estimatedDuration: true,
        },
        driver: { id: true, name: true, cnh: true, cpf: true },
        approval: {
          approvedBy: {
            id: true,
            name: true,
            cnh: true,
            cpf: true,
          },
          date: true,
          observation: true,
          status: true,
        },
        vehicle: {
          id: true,
          plate: true,
          model: true,
          type: true,
          capacity: true,
        },
      },
      where:
        id != null
          ? {
              driver: { id: id },
            }
          : undefined,
      relations: {
        driver: true,
        route: true,
        vehicle: true,
        approval: {
          approvedBy: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<History> {
    const history = await this.historyRepository.findOne({
      where: { id },
      relations: {
        driver: true,
        vehicle: true,
        route: true,
        approval: {
          approvedBy: true,
        },
      },
    });

    if (!history) {
      throw new Error(`Histórico com id ${id} não encontrado.`);
    }

    return history;
  }

  async create(history: HistoryDTO): Promise<History> {
    return this.historyRepository.save(history.toEntity());
  }

  async updateStatus(id: number, status: HistoryApprovalDTO): Promise<History> {
    const history = await this.historyRepository.findOne({ where: { id } });

    if (!history) {
      throw new Error('Histórico não encontrado');
    }

    const approval = new HistoryApproval();
    approval.status = status.status;
    approval.observation = status.observation;
    approval.date = status.date;
    approval.approvedBy = status.approvedBy.toEntity();

    return this.approvalRepository.save(approval).then((approval) => {
      history.approval = approval;
      return this.historyRepository.save(history);
    });
  }

  async findAllByDriverId(driverId: number): Promise<History[]> {
    return this.historyRepository.find({
      where: {
        driver: { id: driverId }, // Ou outra forma de busca relacionada à rota
      },
      relations: ['route', 'driver', 'vehicle'], // Certifique-se de incluir as relações necessárias
    });
  }
}
