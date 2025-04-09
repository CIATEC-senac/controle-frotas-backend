import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Vehicle, VehicleType } from '../entities/vehicle.entity';
import { IsCarPlate } from './is-car-plate.decorator';

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
  @MaxLength(100)
  enterprise: string;

  @IsString()
  @MaxLength(100)
  site: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  status: boolean;

  toEntity() {
    const entity = new Vehicle();
    entity.id = this.id;
    entity.model = this.type;
    entity.capacity = this.capacity;
    entity.year = this.year;
    entity.plate = this.plate;
    entity.enterprise = this.enterprise;
    entity.site = this.site;
    entity.status = this.status;

    return entity;
  }
}
