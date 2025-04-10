import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Maintenance, MaintenanceType } from '../entities/maintenance.entity';
import { VehicleDTO } from 'src/vehicle/dtos/vehicle.dto';

export class MaintenanceDTO {
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
  vehicles: VehicleDTO[];

  toEntity() {
    const entity = new Maintenance();
    entity.id = this.id;
    entity.description = this.description;
    entity.type = this.type;
    entity.date = this.date;

    entity.vehicles = this.vehicles.map((vehicle) => vehicle.toEntity());

    return entity;
  }
}
