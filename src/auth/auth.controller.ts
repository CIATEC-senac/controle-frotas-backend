import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Rota para fazer login com autenticação e usando um retorno http
  @HttpCode(HttpStatus.OK)
  @Post('login')
  // Definindo o tipo do signIndto no body da requisição
  signIn(@Body() signInDto: SignInDTO) {
    return this.authService
      .signIn(signInDto.cpf, signInDto.password)
      .catch((e) => {
        throw e;
      });
  }
}
