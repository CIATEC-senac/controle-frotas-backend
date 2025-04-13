import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/entities/user.entity';

// Especifica quais funções são necessárias para acessar recursos específicos
export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
