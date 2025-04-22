import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Maintenance } from './entities/maintenance.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private repository: Repository<Maintenance>,
  ) {}

  // Remove um registro de manutenção com base no id
  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  // Busca todas as manutenções registradas no banco a partir de uma data
  findAll(from?: Date): Promise<Maintenance[]> {
    const to = new Date(from);
    to.setDate(to.getDate() + 7);

    return this.repository.find({
      select: {
        vehicles: {
          id: true,
          plate: true,
        },
      },
      relations: { vehicles: true },
      order: {
        date: 'DESC',
      },
    });
  }

  // Busca uma manutenção pelo id (Sem relacionamento)
  findOne(id: number): Promise<Maintenance | null> {
    return this.repository.findOneBy({ id });
  }

  // Busca uma manutenção pelo id, incluindo o relacionamento com veículos
  async findOneBy(id: number): Promise<Maintenance | undefined> {
    return this.repository.findOne({
      where: { id },
      relations: {
        vehicles: true,
      },
    });
  }

  // Cria e salva uma nova manutenção no banco
  create(maintenance: Maintenance): Promise<Maintenance> {
    return this.repository.save(maintenance);
  }

  // Atualiza os dados de uma manutenção existente
  update(maintenance: Maintenance) {
    return this.repository.save(maintenance);

    // return this.repository.update(
    //   {
    //     id: maintenance.id,
    //   },
    //   maintenance,
    // );
  }
}
