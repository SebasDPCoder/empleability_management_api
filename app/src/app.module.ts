import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ApplicationsModule } from './applications/applications.module';
import { User } from './users/entities/user.entity';
import { Vacancy } from './vacancies/entities/vacancy.entity';
import { Technology } from './vacancies/entities/technology.entity';
import { Application } from './applications/entities/application.entity';

/**
 * AppModule: módulo raíz que configura:
 * - ConfigModule global para variables de entorno (.env).
 * - TypeOrmModule con configuración asíncrona (lee del .env).
 *   synchronize:true en desarrollo auto-crea tablas. Usar migraciones en producción.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Vacancy, Technology, Application],
        synchronize: true, // ⚠️ Solo para desarrollo. Usar migraciones en producción.
        logging: false,
      }),
    }),
    AuthModule,
    UsersModule,
    VacanciesModule,
    ApplicationsModule,
  ],
})
export class AppModule {}
