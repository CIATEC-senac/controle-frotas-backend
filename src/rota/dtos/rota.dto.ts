import { Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Rota } from 'src/rota/entities/rota.entity';
import { User } from 'src/user/entities/user.entity';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';

export class TrajetoDTO {
  @IsString()
  origem: string;

  @IsString()
  destino: string;

  @IsString({ each: true })
  paradas: string[];
}

export class RotaDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @Type(() => Number)
  @IsNumber()
  tempoTotal: number;

  @Type(() => Number)
  @IsNumber()
  kmTotal: number;

  @ValidateNested()
  trajeto: TrajetoDTO;

  @Type(() => Number)
  @IsNumber()
  veiculo: number;

  @Type(() => Number)
  @IsNumber()
  motorista: number;

  toEntity(): Rota {
    const rota = new Rota();
    rota.id = this.id;
    rota.tempoTotal = this.tempoTotal;
    rota.kmTotal = this.kmTotal;
    rota.trajeto = this.trajeto;

    rota.veiculo = new Veiculo();
    rota.veiculo.id = this.veiculo;

    rota.motorista = new User();
    rota.motorista.id = this.motorista;

    rota.tempoTotal = 0;
    rota.kmTotal = 0;

    return rota;
  }
}
