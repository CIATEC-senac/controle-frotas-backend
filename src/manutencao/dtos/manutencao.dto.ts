import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  } from 'class-validator';
import { IsCarPlate } from "src/veiculo/dtos/is-car-plate.decorator";
import { Manutencao, ManutencaoType } from "../entities/manutencao.entity";


  export class ManutencaoDTO {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    id: number;

    @IsCarPlate()
    placa: String;

    @IsString()
    descricao:String;

    @IsEnum (ManutencaoType)
    @IsOptional ()
    tipo: ManutencaoType = ManutencaoType.CORRETIVA;

    @IsDate ()
    data: Date;


    toEntity () {
        const entity = new Manutencao ();
        entity.id = this.id;
        entity.descricao = this.descricao;
        entity.placa = this.placa;
        entity.tipo = this.tipo;
        entity.data = this.data;

        return entity;
    }
}