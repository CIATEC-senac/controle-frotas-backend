import { IsString, MaxLength } from 'class-validator';

export class SignInDTO {
  @IsString()
  @MaxLength(11)
  cpf: string;

  @IsString()
  password: string;
}
