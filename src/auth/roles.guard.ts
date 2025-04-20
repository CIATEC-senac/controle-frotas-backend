import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { UserRole } from 'src/user/entities/user.entity';
import { RequestUser } from './auth.service';
import { ROLES_KEY } from './roles.decorator';

// Compara as funções atribuídas ao usuário atual com as funções reais exigidas pela rota em processamento.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Busca os cargos exigidos
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não houver cargos exigidos libera o acesso
    if (!requiredRoles) {
      return true;
    }

    const request: Request & { user: RequestUser } = context
      .switchToHttp()
      .getRequest();

    const { user } = request;

    // Verifica se o cargo do usuário está na lista de cargos exigidos
    return requiredRoles.some((role) => user.role == role);
  }
}
