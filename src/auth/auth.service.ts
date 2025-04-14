import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

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

  static encrypt(text: string) {
    return Buffer.from(text).toString('base64');
  }

  async signIn(cpf: string, password: string): Promise<any> {
    const user = await this.userService.findOne(cpf);

    const passwordHash = AuthService.encrypt(password);

    if (user?.password !== passwordHash) {
      throw new UnauthorizedException();
    }

    const payload: RequestUser = {
      sub: user.id,
      registration: user.registration,
      role: user.role,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
