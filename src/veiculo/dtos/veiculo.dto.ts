import { Transform, Type } from 'class-transformer';
import { IsCarPlate } from './is-car-plate.decorator';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { VeiculoType,Veiculo } from '../entities/veiculo.entity';



export class VeiculoDTO {
    @IsOptional()
    @IsEnum(VeiculoType)
    modelo: VeiculoType = VeiculoType.BUS;

    @IsNumber ()
    id: Number;

    @IsNumber()
    capacidade: Number;

    @IsNumber()
    ano: Number;

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

  toEntity() {
    const  entity= new Veiculo();
    entity.modelo = this.modelo;
    entity.capacidade =this.capacidade;
    entity.ano = this.ano;
    entity.placa =this.placa;
    entity.empresa =this.empresa;
    entity.obra = this.obra;
    entity.status =this.status;

    return entity;
  }

}






