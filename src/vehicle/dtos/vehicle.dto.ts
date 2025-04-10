import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Vehicle, VehicleType } from '../entities/vehicle.entity';
import { IsCarPlate } from './is-car-plate.decorator';
import { EnterpriseDTO } from 'src/enterprise/dtos/enterprise.dto';

export class VehicleDTO {
  @IsOptional()
  @IsEnum(VehicleType)
  type: VehicleType = VehicleType.BUS;

  @IsOptional()
  @IsNumber()
  id: number;

  @IsNumber()
  capacity: number;

  @IsNumber()
  year: number;

  @IsCarPlate()
  plate: string;

  @IsString()
  @MaxLength(30)
  model: string;

  @IsDefined()
  enterprise: EnterpriseDTO;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
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

    entity.enterprise = this.enterprise.toEntity();

    return entity;
  }
}
