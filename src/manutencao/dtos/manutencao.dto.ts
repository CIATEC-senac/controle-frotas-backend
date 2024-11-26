import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';
import { Manutencao, ManutencaoType } from '../entities/manutencao.entity';

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

  @Type(() => Date)
  @IsDate()
  data: Date;

  @IsArray()
  @IsNotEmpty()
  veiculos: number[];

  toEntity() {
    const entity = new Manutencao();
    entity.id = this.id;
    entity.descricao = this.descricao;
    entity.veiculos = this.veiculos.map((id) => {
      const veiculo = new Veiculo();
      veiculo.id = id;

      return veiculo;
    });
    entity.tipo = this.tipo;
    entity.data = this.data;

    return entity;
  }
}
