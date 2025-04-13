import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private repository: Repository<Vehicle>,
  ) {}

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  findAll(): Promise<Vehicle[]> {
    return this.repository.find({
      select: {
        maintenances: { id: true, date: true },
      },
      relations: {
        maintenances: true,
      },
    });
  }

  async findOneBy(id: number): Promise<Vehicle | undefined> {
    return this.repository.findOne({
      where: { id },
      relations: { maintenances: true },
    });
  }

  create(vehicle: Vehicle): Promise<Vehicle> {
    return this.repository
      .insert(vehicle)
      .then((result) =>
        this.repository.findOneBy({ id: result.identifiers.at(0).id }),
      );
  }

  update(vehicle: Vehicle): Promise<Vehicle> {
    return this.repository
      .update({ id: vehicle.id }, vehicle)
      .then(() => vehicle);
  }
}
