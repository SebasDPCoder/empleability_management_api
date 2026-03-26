import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';

config(); // Carga el .env

/**
 * Seeder: crea usuarios con roles Admin y Gestor.
 * Esta es la ÚNICA forma de crear estos roles en el sistema.
 * Los coders se registran a través del endpoint /api/auth/register.
 *
 * Uso: npm run seed
 */

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'empleability_db'),
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Conexión a base de datos establecida.\n');

  const userRepository = AppDataSource.getRepository('users');

  const seedUsers = [
    {
      name: 'Admin',
      email: 'admin@riwi.io',
      password: await bcrypt.hash('Admin123!', 10),
      role: 'admin',
    },
    {
      name: 'Gestor',
      email: 'gestor@riwi.io',
      password: await bcrypt.hash('Gestor123!', 10),
      role: 'gestor',
    },
    {
      name: 'Gestor Empleabilidad',
      email: 'empleabilidad@riwi.io',
      password: await bcrypt.hash('Empleabilidad123!', 10),
      role: 'gestor',
    },
  ];

  for (const userData of seedUsers) {
    const existing = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (existing) {
      console.log(`⏭️  Usuario "${userData.email}" ya existe. Omitiendo...`);
      continue;
    }

    const user = userRepository.create(userData);
    await userRepository.save(user);
    console.log(`✅ Usuario creado: ${userData.email} (${userData.role})`);
  }

  console.log('\n🌱 Seed completado exitosamente.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error durante el seed:', err);
  process.exit(1);
});
