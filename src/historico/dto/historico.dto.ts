import { IsEnum, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { StatusHistorico } from 'src/historico/entities/historico.entity';
import { Historico } from 'src/historico/entities/historico.entity';

export class HistoricoDTO {
  @IsOptional()
  @IsNumber()
  motoristaId: number; 

  @IsOptional() 
  origem: string;

  @IsOptional()  
  destino: string;

  @IsOptional()
  kmInicial: number;

  @IsOptional()
  horaInicio: Date;

  @IsOptional()
  fotoInicio: string;

  @IsOptional()
  kmFinal: number;

  @IsOptional()
  horaFinal: Date;

  @IsOptional()
  fotoFinal: string;

  @IsEnum(StatusHistorico)
  status: StatusHistorico;

  @IsOptional()
  descricao: string;  

  @IsOptional()
  rotaId: number;

  @IsOptional() 
  @IsBoolean()
  paradaNaoProgramada?: boolean;

  @IsOptional() 
  @IsString()
  descricaoParadaNaoProgramada?: string; 

  toEntity() {
    const historico = new Historico();
    historico.kmInicial = this.kmInicial;
    historico.kmFinal = this.kmFinal;
    historico.horaInicio = this.horaInicio;
    historico.horaFinal = this.horaFinal;
    historico.fotoInicio = this.fotoInicio;
    historico.fotoFinal = this.fotoFinal;
    historico.origem = this.origem;
    historico.destino = this.destino;
    historico.status = this.status;
    historico.descricao = this.descricao;
    historico.paradaNaoProgramada = this.paradaNaoProgramada;
    historico.descricaoParadaNaoProgramada = this.descricaoParadaNaoProgramada; 
    return historico;
  }
}
