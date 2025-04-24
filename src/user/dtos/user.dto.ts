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
import { EnterpriseDTO } from 'src/enterprise/dtos/enterprise.dto';
import { User, UserRole, UserSource } from '../entities/user.entity';

export class UserDTO {
  @IsOptional()
  id: number;

  @IsNumber()
  registration: number;

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
  password: string;

  @IsOptional()
  @IsDefined()
  enterprise?: EnterpriseDTO;

  toEntity() {
    const entity = new User();
    entity.id = this.id;
    entity.registration = this.registration;
    entity.name = this.name;
    entity.cpf = this.cpf;
    entity.email = this.email;
    entity.admittedAt = this.admittedAt;
    entity.status = this.status;
    entity.role = this.role;
    entity.cnh = this.cnh;
    entity.source = this.source;

    if (this.id == undefined) {
      entity.password = AuthService.encrypt('senha');
    }

    entity.enterprise = this.enterprise?.toEntity();

    return entity;
  }
}
