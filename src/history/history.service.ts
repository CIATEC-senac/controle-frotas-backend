import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History, HistoryStatus } from './entities/history.entity';
import { HistoryDTO } from './dto/history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async findAll(): Promise<History[]> {
    return this.historyRepository.find();
  }

  async findOne(id: number): Promise<History> {
    const history = await this.historyRepository.findOne({
      where: { id },
      relations: { driver: true, vehicle: true, route: true },
    });

    if (!history) {
      throw new Error(`Histórico com id ${id} não encontrado.`);
    }

    return history;
  }

  async create(history: HistoryDTO): Promise<History> {
    return this.historyRepository.save(history.toEntity());
  }

  async updateStatus(id: number, status: HistoryStatus): Promise<History> {
    const history = await this.historyRepository.findOne({ where: { id } });

    if (!history) {
      throw new Error('Histórico não encontrado');
    }

    history.status = status;

    return this.historyRepository.save(history);
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
