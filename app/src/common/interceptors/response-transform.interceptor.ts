import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * Interceptor global que estandariza TODAS las respuestas de la API.
 * Envuelve cualquier dato en { success, data, message }.
 * Aplica a respuestas exitosas; las excepciones son manejadas por NestJS.
 */
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data ?? null,
        message: data?.message ?? 'Operación exitosa',
      })),
    );
  }
}
