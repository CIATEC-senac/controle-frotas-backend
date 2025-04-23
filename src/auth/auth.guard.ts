import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.module';

// Decorador que indica que essa classe pode ser injetável
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // Serviço do NestJS usado para manipular tokens JWT (verificar, assinar, etc.)
    private jwtService: JwtService,
    // Utilitário que permite acessar metadados definidos por decorators personalizados (como @Public)
    private reflector: Reflector,
  ) {}

  // Método principal do guard — determina se a requisição pode continuar ou não
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Usando a classe Reflector para retornar true quando os isPublic metadados forem encontrados
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // Se a rota for pública, libera o acesso sem autenticação
      return true;
    }

    // Recupera o objeto da requisição HTTP
    const request = context.switchToHttp().getRequest();

    // Extrai o token JWT do cabeçalho Authorization
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      // Se não houver token, lança erro de "Não autorizado"
      throw new UnauthorizedException();
    }

    try {
      // Verifica e valida o token usando a chave secreta
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // Se o token for válido, adiciona os dados do usuário no objeto da requisição
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  // Função que extrai o token do cabeçalho Authorization
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // Retorna o token apenas se o tipo for 'Bearer'
    return type === 'Bearer' ? token : undefined;
  }
}
