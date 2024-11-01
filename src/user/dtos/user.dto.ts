import * as bcrypt from 'bcrypt';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';
import { userConstants } from '../constants';
import { User, UserRole } from '../entities/user.entity';

export class UserDTO {
  @IsNumberString()
  matricula: number;

  @IsString()
  @MaxLength(100)
  nome: string;

  @IsNumberString()
  @MaxLength(11)
  cpf: string;

  @IsEmail()
  email: string;

  @Type(() => Date)
  @IsDate()
  dataAdmissao: Date;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  status: boolean;

  @IsNotEmpty()
  obra: string;

  @IsNumberString()
  funcao: number;

  @IsNumberString()
  cnh: string;

  @IsEnum(UserRole)
  tipo: UserRole;

  @IsString()
  senha: string;

  async toEntity() {
    const entity = new User();
    entity.matricula = this.matricula;
    entity.nome = this.nome;
    entity.cpf = this.cpf;
    entity.email = this.email;
    entity.dataAdmissao = this.dataAdmissao;
    entity.status = this.status;
    entity.obra = this.obra;
    entity.funcao = this.funcao;
    entity.cnh = this.cnh;
    entity.tipo = this.tipo;
    entity.senha = await bcrypt.hash(this.senha, userConstants.salt);

    return entity;
  }
}
