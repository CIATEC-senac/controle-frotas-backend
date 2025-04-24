import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { VehicleDTO } from 'src/vehicle/dtos/vehicle.dto';
import { Maintenance, MaintenanceType } from '../entities/maintenance.entity';

export class MaintenanceVehicleDTO {
  @IsNumber()
  id: number;
}

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

  @ValidateNested()
  vehicles: MaintenanceVehicleDTO[];

  toEntity() {
    const entity = new Maintenance();
    entity.id = this.id;
    entity.description = this.description;
    entity.type = this.type;
    entity.date = this.date;

    entity.vehicles = this.vehicles.map((vehicle) => {
      const vehicleDto = new VehicleDTO();
      vehicleDto.id = vehicle.id;
      return vehicleDto.toEntity();
    });

    return entity;
  }
}
