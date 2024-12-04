import {
  IsNumber,
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
  id: number;

  @IsNumber()
  tempoTotal: number;

  @IsNumber()
  kmTotal: number;

  @ValidateNested()
  trajeto: TrajetoDTO;

  @IsNumber()
  veiculo: number;

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

    return rota;
  }
}
