import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
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
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    return this.repository
      .find({
        select: {
          maintenances: {
            id: true,
            date: true,
          },
        },
        relations: {
          maintenances: true,
        },
      })
      .then((vehicles) => {
        return vehicles.map((vehicle) => {
          vehicle.status = vehicle.maintenances?.some((maintenance) => {
            return maintenance.date.getTime() >= today.getTime();
          });

          return vehicle;
        });
      });
  }

  findOne(placa: string): Promise<Vehicle | null> {
    return this.repository.findOneBy({ plate: placa });
  }

  async findOneBy(id: number): Promise<Vehicle | undefined> {
    return this.repository.findOne({
      where: { id },
      relations: {
        maintenances: true,
      },
    });
  }

  create(vehicle: Vehicle): Promise<InsertResult> {
    return this.repository.insert(vehicle);
  }

  update(vehicle: Vehicle) {
    return this.repository.update(
      {
        id: vehicle.id,
      },
      vehicle,
    );
  }
}
