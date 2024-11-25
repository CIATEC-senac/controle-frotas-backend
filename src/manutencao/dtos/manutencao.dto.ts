import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';
import { ManutencaoType, Manutencao } from '../entities/manutencao.entity';
import { ManyToOne, JoinColumn } from 'typeorm';


export class ManutencaoDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;
  

  @IsString()
  descricao: string;

  @IsEnum(ManutencaoType)
  @IsOptional()
  tipo: ManutencaoType = ManutencaoType.CORRETIVA;

  @IsDate()
  data: Date;

  @ManyToOne(() => Veiculo, veiculo => veiculo.manutencoes, { eager: true })
  veiculo: Veiculo; 

  toEntity() {
    const entity = new Manutencao();
    entity.id = this.id;
    entity.descricao = this.descricao;
    entity.veiculo = new Veiculo();
    entity.veiculo = this.veiculo; 
    entity.tipo = this.tipo;
    entity.data = this.data;

    return entity;
  }
}
