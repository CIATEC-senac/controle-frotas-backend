import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Maintenance } from './entities/maintenance.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private repository: Repository<Maintenance>,
  ) {}

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  findAll(from: Date): Promise<Maintenance[]> {
    const to = new Date(from);
    to.setDate(to.getDate() + 7);

    return this.repository.find({
      where: {
        date: Between(from, to),
      },
      relations: {
        vehicles: true,
      },
    });
  }

  findOne(id: number): Promise<Maintenance | null> {
    return this.repository.findOneBy({ id });
  }

  async findOneBy(id: number): Promise<Maintenance | undefined> {
    return this.repository.findOne({
      where: { id },
      relations: {
        vehicles: true,
      },
    });
  }

  create(maintenance: Maintenance): Promise<Maintenance> {
    return this.repository.save(maintenance);
  }

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
