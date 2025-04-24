import { IsString, MaxLength } from 'class-validator';

// Classe para fazer login
export class SignInDTO {
  @IsString()
  @MaxLength(11)
  cpf: string;

  @IsString()
  password: string;
}
