import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ApiKeyGuard } from './guards/api-key.guard';
import { RolesGuard } from './guards/roles.guard';

/**
 * AuthModule: centraliza toda la infraestructura de autenticación.
 * - JwtModule: configurado de forma asíncrona para leer JWT_SECRET del .env. 
 * - PassportModule: habilita el sistema de strategies de Passport.
 * - UsersModule: importado para acceder al UsersService.
 * - Guards exportados para ser usados en otros módulos.
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '24h') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ApiKeyGuard, RolesGuard],
  exports: [JwtStrategy, ApiKeyGuard, RolesGuard, JwtModule],
})
export class AuthModule { }
