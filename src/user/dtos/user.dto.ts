import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AuthService } from 'src/auth/auth.service';
import { User, UserRole, UserSource } from '../entities/user.entity';
import { EnterpriseDTO } from 'src/enterprise/dtos/enterprise.dto';

export class UserDTO {
  @IsOptional()
  id: number;

  @IsNumber()
  registry: number;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsNumberString()
  @MaxLength(11)
  cpf: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsDate()
  admittedAt: Date;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  status: boolean;

  @IsEnum(UserRole)
  role: UserRole = UserRole.DRIVER;

  @IsString()
  cnh: string;

  @IsOptional()
  @IsEnum(UserSource)
  source: UserSource = UserSource.OUTSOURCED;

  @IsOptional()
  @IsString()
  password: string = 'senha';

  @IsDefined()
  enterprise: EnterpriseDTO;

  toEntity() {
    const entity = new User();
    entity.id = this.id;
    entity.registry = this.registry;
    entity.name = this.name;
    entity.cpf = this.cpf;
    entity.email = this.email;
    entity.admittedAt = this.admittedAt;
    entity.status = this.status;
    entity.role = this.role;
    entity.cnh = this.cnh;
    entity.source = this.source;
    entity.password = AuthService.encrypt(this.password);
    entity.enterprise = this.enterprise.toEntity();

    return entity;
  }
}
