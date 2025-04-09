import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AuthService } from 'src/auth/auth.service';
import { User, UserRole, UserSource } from '../entities/user.entity';

export class UserDTO {
  @IsOptional()
  id: number;

  @Type(() => Number)
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

  @Type(() => Date)
  @IsDate()
  amittedAt: Date;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  status: boolean;

  @IsNotEmpty()
  site: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole = UserRole.DRIVER;

  @Type(() => Number)
  @IsNumber()
  cnh: string;

  @IsOptional()
  @IsEnum(UserSource)
  source: UserSource = UserSource.OUTSOURCED;

  @IsOptional()
  @IsString()
  password: string = 'senha';

  toEntity() {
    const entity = new User();
    entity.id = this.id;
    entity.registration = this.registration;
    entity.name = this.name;
    entity.cpf = this.cpf;
    entity.email = this.email;
    entity.admittedAt = this.amittedAt;
    entity.status = this.status;
    entity.site = this.site;
    entity.role = this.role;
    entity.cnh = this.cnh;
    entity.source = this.source;
    entity.password = AuthService.encrypt(this.password);

    return entity;
  }
}
