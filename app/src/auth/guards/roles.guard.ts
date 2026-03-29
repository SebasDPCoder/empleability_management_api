import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/enums/role.enum';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';

/**
 * RolesGuard: compara el rol del usuario autenticado con los roles
 * requeridos en el decorador @Roles().
 * IMPORTANTE: debe ejecutarse DESPUÉS del JwtAuthGuard para que
 * request.user esté poblado.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay @Roles() definido, el endpoint es accesible por cualquier usuario autenticado
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    
    if (!user) {
      throw new ForbiddenException('No autenticado o sesión expirada (req.user no encontrado).');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Se requiere uno de los siguientes roles: ${requiredRoles.join(', ')}. Tu rol actual es: ${user.role || 'ninguno'}`,
      );
    }

    return true;
  }
}
