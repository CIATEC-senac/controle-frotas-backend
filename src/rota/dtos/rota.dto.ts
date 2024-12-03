import { IsNotEmpty, IsString, IsOptional, IsArray, IsInt, IsBoolean, IsNumber } from 'class-validator';
import { Rota } from 'src/rota/entities/rota.entity';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';

export class RotaDTO {
  @IsOptional()
  id: number;

  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsString()
  empresa: string;

  @IsNumber()
  tempoTotal: number;

  @IsNumber()
  capacidade: number;

  @IsNumber()
  kmTotal: number;

  @IsNotEmpty()
  @IsString()
  destino: string;

  @IsNotEmpty()
  @IsString()
  origem: string;

  // Agora waypoints é um array de strings (endereços)
  @IsOptional()
  @IsArray()
  waypoints: string[];

  @IsOptional()
  @IsString()
  rotaJson?: any;

  @IsNotEmpty()
  @IsString()
  placa: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  toEntity(): Rota {
    const rota = new Rota();
    rota.id = this.id;
    rota.status = this.status;
    rota.empresa = this.empresa;
    rota.tempoTotal = this.tempoTotal;
    rota.capacidade = this.capacidade;
    rota.kmTotal = this.kmTotal;
    rota.destino = this.destino;
    rota.origem = this.origem;
    rota.waypoints = [];  // preencher isso no service
    rota.rotaJson = this.rotaJson;
    rota.placa = this.placa;
    rota.name = this.name;
    return rota;
  }
}
