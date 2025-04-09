import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  static encrypt(senha: string) {
    return Buffer.from(senha).toString('base64');
  }

  async signIn(cpf: string, senha: string): Promise<any> {
    const user = await this.userService.findOne(cpf);

    const passwordHash = AuthService.encrypt(senha);

    if (user?.password !== passwordHash) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      registration: user.registration,
      role: user.role,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
