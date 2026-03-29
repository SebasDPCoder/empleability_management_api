import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum';
import { Location } from '../../common/enums/location.enum';
import { Modality } from '../../common/enums/modality.enum';

config(); // Carga el .env

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
  const technologyRepository = AppDataSource.getRepository('technologies');
  const vacancyRepository = AppDataSource.getRepository('vacancies');
  const applicationRepository = AppDataSource.getRepository('applications');

  // 1. Seed Technologies
  console.log('🌱 Seed de Tecnologías...');
  const techNames = [
    'React',
    'Node.js',
    'TypeScript',
    'NestJS',
    'PostgreSQL',
    'Docker',
    'AWS',
    'Python',
    'Java',
    'Angular',
  ];
  const technologies: any[] = [];

  for (const name of techNames) {
    let tech = await technologyRepository.findOne({ where: { name } });
    if (!tech) {
      tech = technologyRepository.create({ name });
      await technologyRepository.save(tech);
      console.log(`✅ Tecnología creada: ${name}`);
    } else {
      console.log(`⏭️  Tecnología "${name}" ya existe.`);
    }
    technologies.push(tech);
  }

  // 2. Seed Users (Admin, Gestor, Coders)
  console.log('\n🌱 Seed de Usuarios...');
  const seedUsers = [
    {
      name: 'Admin',
      email: 'admin@riwi.io',
      password: await bcrypt.hash('Admin123!', 10),
      role: Role.ADMIN,
    },
    {
      name: 'Gestor',
      email: 'gestor@riwi.io',
      password: await bcrypt.hash('Gestor123!', 10),
      role: Role.GESTOR,
    },
    {
      name: 'Gestor Empleabilidad',
      email: 'empleabilidad@riwi.io',
      password: await bcrypt.hash('Empleabilidad123!', 10),
      role: Role.GESTOR,
    },
    {
      name: 'Coder Uno',
      email: 'coder@riwi.io',
      password: await bcrypt.hash('Password123!', 10),
      role: Role.CODER,
    },
    {
      name: 'Coder Dos',
      email: 'coder2@riwi.io',
      password: await bcrypt.hash('Coder123!', 10),
      role: Role.CODER,
    },
  ];

  const userMaps = new Map<string, any>();

  for (const userData of seedUsers) {
    let user = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!user) {
      user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`✅ Usuario creado: ${userData.email} (${userData.role})`);
    } else {
      console.log(`⏭️  Usuario "${userData.email}" ya existe.`);
    }
    userMaps.set(userData.email, user);
  }

  // 3. Seed Vacancies
  console.log('\n🌱 Seed de Vacantes...');
  const seedVacancies = [
    {
      title: 'Fullstack Developer',
      description: 'Buscamos un desarrollador con experiencia en React y Node.js.',
      seniority: 'Middle',
      softSkills: 'Proactivo, Trabajo en equipo',
      location: Location.MEDELLIN,
      modality: Modality.HYBRID,
      salaryRange: '4M - 6M',
      company: 'Riwi Tech',
      maxApplicants: 10,
      technologies: [
        technologies.find((t) => t.name === 'React'),
        technologies.find((t) => t.name === 'Node.js'),
        technologies.find((t) => t.name === 'TypeScript'),
      ],
    },
    {
      title: 'Backend NestJS Expert',
      description: 'Lidera proyectos backend robustos con NestJS.',
      seniority: 'Senior',
      softSkills: 'Liderazgo, Comunicación asertiva',
      location: Location.BOGOTA,
      modality: Modality.REMOTE,
      salaryRange: '8M - 12M',
      company: 'Global Dev',
      maxApplicants: 5,
      technologies: [
        technologies.find((t) => t.name === 'NestJS'),
        technologies.find((t) => t.name === 'PostgreSQL'),
        technologies.find((t) => t.name === 'Docker'),
      ],
    },
    {
      title: 'Junior Frontend Dev',
      description: 'Oportunidad para crecer con Angular.',
      seniority: 'Junior',
      softSkills: 'Ganas de aprender',
      location: Location.BARRANQUILLA,
      modality: Modality.IN_PERSON,
      salaryRange: '2M - 3M',
      company: 'Startup S.A.S',
      maxApplicants: 20,
      technologies: [
        technologies.find((t) => t.name === 'Angular'),
        technologies.find((t) => t.name === 'TypeScript'),
      ],
    },
  ];

  const vacancyMaps = new Map<string, any>();

  for (const vacancyData of seedVacancies) {
    let vacancy = await vacancyRepository.findOne({
      where: { title: vacancyData.title, company: vacancyData.company },
    });

    if (!vacancy) {
      vacancy = vacancyRepository.create(vacancyData);
      await vacancyRepository.save(vacancy);
      console.log(`✅ Vacante creada: ${vacancyData.title} en ${vacancyData.company}`);
    } else {
      console.log(`⏭️  Vacante "${vacancyData.title}" en "${vacancyData.company}" ya existe.`);
    }
    vacancyMaps.set(vacancyData.title, vacancy);
  }

  // 4. Seed Applications (Coders applying to vacancies)
  console.log('\n🌱 Seed de Postulaciones...');
  const coder1 = userMaps.get('coder1@riwi.io');
  const coder2 = userMaps.get('coder2@riwi.io');
  const vacancyFullstack = vacancyMaps.get('Fullstack Developer');
  const vacancyBackend = vacancyMaps.get('Backend NestJS Expert');

  const seedApplications = [
    { userId: coder1.id, vacancyId: vacancyFullstack.id },
    { userId: coder2.id, vacancyId: vacancyFullstack.id },
    { userId: coder1.id, vacancyId: vacancyBackend.id },
  ];

  for (const appData of seedApplications) {
    const existing = await applicationRepository.findOne({
      where: { userId: appData.userId, vacancyId: appData.vacancyId },
    });

    if (!existing) {
      const app = applicationRepository.create(appData);
      await applicationRepository.save(app);
      console.log(`✅ Postulación creada: Coder a "${appData.vacancyId}"`);
    } else {
      console.log('⏭️  Postulación ya existe.');
    }
  }

  console.log('\n🌱 Seed completado exitosamente.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error durante el seed:', err);
  process.exit(1);
});
