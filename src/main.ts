import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

/**
 * Bootstrap bootstraps la aplicación:
 * - ValidationPipe global: valida todos los DTOs automáticamente.
 *   whitelist:true elimina propiedades no declaradas en el DTO.
 *   transform:true convierte tipos automáticamente (string → number, etc).
 * - ResponseTransformInterceptor: estandariza TODAS las respuestas.
 * - Swagger: documentación interactiva en /api.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global de rutas
  app.setGlobalPrefix('api');

  // CORS habilitado para desarrollo
  app.enableCors();

  // ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Interceptor global de respuestas estandarizadas
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Empleability Management API')
    .setDescription(
      'API REST para gestión de vacantes de empleabilidad y postulaciones de coders del programa Riwi. ' +
        '\n\n**Headers requeridos:**\n- `Authorization: Bearer <token>` (JWT)\n- `x-api-key: riwi-api-key-2026`',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'JWT',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'ApiKey',
    )
    .addTag('Auth', 'Registro e inicio de sesión')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Vacancies', 'Gestión de vacantes')
    .addTag('Applications', 'Postulaciones a vacantes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Aplicación corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api\n`);
}

bootstrap();
