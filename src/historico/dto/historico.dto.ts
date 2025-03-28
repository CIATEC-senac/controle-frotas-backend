import {
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsDecimal,
  ValidateNested,
} from 'class-validator';
import { Rota } from 'src/rota/entities/rota.entity';
import { Historico } from '../entities/historico.entity';
import { Coordenada } from 'src/rota/entities/rota.entity';

export class TrajetoCoordenadasDTO {
  @IsOptional()
  @ValidateNested()
  origem: Coordenada;

  @IsOptional()
  @ValidateNested()
  destino: Coordenada;

  @IsOptional()
  @ValidateNested({ each: true })
  paradas: Coordenada[];
}

export class TrajetoDTO {
  @IsString()
  origem: string;

  @IsString()
  destino: string;

  @IsString({ each: true })
  paradas: string[];
}

export class HistoricoDto {
  @IsOptional()
  id: number;

  @IsNumber()
  odometro_Incial: number;

  @IsNumber()
  odometro_Final: number;

  @IsString()
  observacao: string;

  @IsBoolean()
  status: boolean;

  @IsDecimal()
  km_concluido: number;

  @IsOptional()
  @IsString()
  odometro_inicial_img?: string;

  @IsOptional()
  @IsString()
  odometro_final_img?: string;

  @IsOptional()
  @IsNumber()
  rota_id?: number;

  @ValidateNested()
  trajetoCoordenadas: TrajetoCoordenadasDTO;

  @ValidateNested()
  trajeto: TrajetoDTO;

  toEntity(): Historico {
    const historico = new Historico();

    historico.id = this.id;
    historico.odometroIncial = this.odometro_Incial;
    historico.odometroFinal = this.odometro_Final;
    historico.observacao = this.observacao;
    historico.status = this.status;
    historico.kmConcluido = this.km_concluido;
    historico.odometroInicialImg = this.odometro_inicial_img;
    historico.odometroFinalImg = this.odometro_final_img;
    historico.trajetoCoordenadas = this.trajetoCoordenadas;
    historico.trajeto = this.trajeto;

    if (this.rota_id) {
      historico.rota = new Rota();
      historico.rota.id = this.rota_id;
    }

    return historico;
  }
}
