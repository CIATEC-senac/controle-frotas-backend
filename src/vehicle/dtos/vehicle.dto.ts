import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { EnterpriseDTO } from 'src/enterprise/dtos/enterprise.dto';
import { Vehicle, VehicleType } from '../entities/vehicle.entity';
import { IsCarPlate } from './is-car-plate.decorator';

export class VehicleDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsEnum(VehicleType)
  type: VehicleType = VehicleType.BUS;

  @IsNumber()
  capacity: number;

  @IsNumber()
  year: number;

  @IsCarPlate()
  plate: string;

  @IsString()
  @MaxLength(30)
  model: string;

  @IsOptional()
  @IsDefined()
  enterprise?: EnterpriseDTO;

  @IsBoolean()
  status: boolean;

  toEntity() {
    const entity = new Vehicle();
    entity.id = this.id;
    entity.type = this.type;
    entity.capacity = this.capacity;
    entity.year = this.year;
    entity.plate = this.plate;
    entity.model = this.model;
    entity.status = this.status;

    entity.enterprise = this.enterprise ? this.enterprise.toEntity() : null;

    return entity;
  }
}
