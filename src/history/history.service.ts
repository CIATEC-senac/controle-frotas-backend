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
    const coordinate = { lat: true, lng: true };

    return this.historyRepository.find({
      select: {
        id: true,
        odometerInitial: true,
        odometerFinal: true,
        observation: true,
        status: true,
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
        driver: { id: true, name: true, cnh: true },
        vehicle: {
          id: true,
          plate: true,
          model: true,
          type: true,
          capacity: true,
        },
      },
      relations: { driver: true, route: true, vehicle: true },
    });
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
}
