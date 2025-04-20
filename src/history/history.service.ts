import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { HistoryApprovalDTO } from './dto/history.approval.dto';
import { HistoryDTO } from './dto/history.dto';
import { HistoryApproval } from './entities/history-approval.entity';
import { History } from './entities/history.entity';
import { completeSelect } from './select-options';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(HistoryApproval)
    private readonly approvalRepository: Repository<HistoryApproval>,
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
      },
    });

    if (!history) {
      throw new Error(`Histórico com id ${id} não encontrado.`);
    }

    return history;
  }

  // Cria um novo histórico no banco de dados
  async create(history: HistoryDTO): Promise<History> {
    return this.historyRepository.save(history.toEntity());
  }

  // Atualiza um histórico exixtente
  // Após a atualização, busca novamente o histórico atualizado para retornar
  async update(history: HistoryDTO): Promise<History> {
    return this.historyRepository
      .update({ id: history.id }, history.toEntity())
      .then(() => this.findOne(history.id));
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
}
