import { IsBoolean, IsNumber, IsString, MaxLength, IsOptional, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { Rota } from '../entities/rota.entity';

export class RotaDTO {
  @IsBoolean()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  status: boolean;

  @IsOptional()
  id: number;

  @IsNumber()
  capacidade: number; 

  @IsString()
  @MaxLength(100)
  empresa: string;

  @IsNumber()
  tempoTotal: number;

  @IsNumber()
  kmTotal: number;

  @IsString()
  @IsNotEmpty()
  destino: string;

  @IsString()
  @IsNotEmpty()
  origem: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  waypoints: string[];

  @IsOptional()
  rotaJson: any;

  @IsString()
  @IsNotEmpty()
  placa: string= 'ABC1234';

  toEntity(): Rota {
    const entity = new Rota();
    entity.status = this.status !== undefined ? this.status : true;
    entity.capacidade = this.capacidade;
    entity.empresa = this.empresa;
    entity.tempoTotal = this.tempoTotal;
    entity.kmTotal = this.kmTotal;
    entity.destino = this.destino;
    entity.origem = this.origem;
    entity.waypoints = this.waypoints || [];
    entity.rotaJson = this.rotaJson;
    entity.placa = this.placa; 
    return entity;
  }
}
