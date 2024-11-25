import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Veiculo, VeiculoType } from '../entities/veiculo.entity';
import { IsCarPlate } from './is-car-plate.decorator';
import { Manutencao } from 'src/manutencao/entities/manutencao.entity';
import { OneToMany } from 'typeorm';


export class VeiculoDTO {
  @IsOptional()
  @IsEnum(VeiculoType)
  modelo: VeiculoType = VeiculoType.BUS;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @Type(() => Number)
  @IsNumber()
  capacidade: number;

  @Type(() => Number)
  @IsNumber()
  ano: number;

  @IsCarPlate()
  placa: string;

  @IsString()
  @MaxLength(100)
  empresa: string;

  @IsString()
  @MaxLength(100)
  obra: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  status: boolean;

  @OneToMany(() => Manutencao, (manutencao) => manutencao.veiculo)
  manutencoes: Manutencao[];


  toEntity() {
    const entity = new Veiculo();
    entity.id = this.id;
    entity.modelo = this.modelo;
    entity.capacidade = this.capacidade;
    entity.ano = this.ano;
    entity.placa = this.placa;
    entity.empresa = this.empresa;
    entity.obra = this.obra;
    entity.status = this.status;

    return entity;
  }
}
