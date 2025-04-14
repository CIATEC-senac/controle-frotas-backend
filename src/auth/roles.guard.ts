import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from 'src/user/entities/user.entity';
import { ROLES_KEY } from './roles.decorator';
import { Request } from 'express';
import { RequestUser } from './auth.service';

// Compara as funções atribuídas ao usuário atual com as funções reais exigidas pela rota em processamento.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request: Request & { user: RequestUser } = context
      .switchToHttp()
      .getRequest();

    const { user } = request;

    return requiredRoles.some((role) => user.role == role);
  }
}
