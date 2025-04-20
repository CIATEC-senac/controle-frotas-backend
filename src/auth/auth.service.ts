import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

// Define o tipo do payload que será incluído no token JWT
export type RequestUser = {
  sub: number;
  registration: number;
  role: UserRole;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Método estático para criptografar a senha (simplesmente codifica em base64)
  static encrypt(text: string) {
    return Buffer.from(text).toString('base64');
  }

  // Método principal para fazer login, recebe cpf e senha
  async signIn(cpf: string, password: string): Promise<any> {
    // Busca usuário por cpf
    const user = await this.userService.findOne(cpf);

    // Codifica a senha fornecida pelo usuário
    const passwordHash = AuthService.encrypt(password);

    // Verifica se a senha cadastrada do usuário é diferente da fornecida pelo usuário
    if (user?.password !== passwordHash) {
      // Retorna um erro de não autorizado
      throw new UnauthorizedException();
    }

    // Define o payload que será incluído no token JWT
    const payload: RequestUser = {
      sub: user.id,
      registration: user.registration,
      role: user.role,
    };

    // retorna o token assinado com o payload
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
