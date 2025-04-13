import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Enterprise } from '../entities/enterprise.entity';

export class EnterpriseDTO {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  toEntity() {
    const entity = new Enterprise();
    entity.id = this.id;
    entity.name = this.name;

    return entity;
  }
}
