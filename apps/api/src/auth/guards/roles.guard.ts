import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Pega os cargos permitidos na rota (definidos pelo @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se a rota não tiver @Roles, ela é liberada (apenas JWT basta)
    if (!requiredRoles) {
      return true;
    }

    // Pega o usuário que o JwtAuthGuard injetou na requisição
    const { user } = context.switchToHttp().getRequest();
    
    // Verifica se o cargo do usuário está na lista de permitidos
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException('Acesso negado: você não tem o cargo necessário.');
    }

    return true;
  }
}