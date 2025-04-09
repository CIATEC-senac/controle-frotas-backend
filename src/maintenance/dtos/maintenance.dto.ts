import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Maintenance, MaintenanceType } from '../entities/maintenance.entity';

export class MaintenanceDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  description: string;

  @IsEnum(MaintenanceType)
  @IsOptional()
  type: MaintenanceType = MaintenanceType.CORRECTIVE;

  @IsDate()
  date: Date;

  @IsArray()
  @IsNotEmpty()
  vehicles: number[];

  toEntity() {
    const entity = new Maintenance();
    entity.id = this.id;
    entity.description = this.description;
    entity.type = this.type;
    entity.date = this.date;

    entity.vehicles = this.vehicles.map((id) => {
      const vehicle = new Vehicle();
      vehicle.id = id;

      return vehicle;
    });

    return entity;
  }
}
