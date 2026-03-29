import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard: guard estándar que valida el JWT en el header Authorization.
 * Extiende el AuthGuard de Passport con la estrategia 'jwt'.
 * Se aplica a todos los endpoints protegidos para garantizar autenticación.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const result = super.canActivate(context);
    return result;
  }
}
