import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * ApiKeyGuard: valida el header x-api-key en cada request.
 * Es una capa de seguridad adicional al JWT para prevenir
 * acceso desde clientes desconocidos aunque tengan un token válido.
 * La clave se configura en la variable de entorno API_KEY.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('API_KEY');

    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException(
        'API Key inválida o ausente. Incluye el header x-api-key.',
      );
    }

    return true;
  }
}
