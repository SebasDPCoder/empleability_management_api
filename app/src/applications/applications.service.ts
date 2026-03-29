import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { VacanciesService } from '../vacancies/vacancies.service';
import { CreateApplicationDto } from './dto/create-application.dto';

/**
 * ApplicationsService: contiene TODAS las reglas de negocio de postulación.
 *
 * Reglas validadas en orden:
 * 1. La vacante debe existir y estar activa.
 * 2. El coder no puede postularse dos veces a la misma vacante.
 * 3. El coder no puede tener más de 3 postulaciones activas (vacantes activas).
 * 4. La vacante debe tener cupo disponible.
 */
@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly vacanciesService: VacanciesService,
  ) {}

  async apply(dto: CreateApplicationDto, userId: string): Promise<Application> {
    // Regla 1: La vacante debe existir y estar activa
    const vacancy = await this.vacanciesService.findOne(dto.vacancyId);
    if (!vacancy.isActive) {
      throw new BadRequestException(
        'La vacante no está disponible actualmente.',
      );
    }

    // Regla 2: No puede postularse dos veces a la misma vacante
    const alreadyApplied = await this.applicationRepository.findOne({
      where: { userId, vacancyId: dto.vacancyId },
    });
    if (alreadyApplied) {
      throw new ConflictException('Ya te has postulado a esta vacante.');
    }

    // Regla 3: No puede tener más de 3 postulaciones activas
    const activeApplications = await this.applicationRepository
      .createQueryBuilder('app')
      .innerJoin('app.vacancy', 'vacancy')
      .where('app.userId = :userId', { userId })
      .andWhere('vacancy.isActive = true')
      .getCount();

    if (activeApplications >= 3) {
      throw new BadRequestException(
        'Has alcanzado el límite máximo de 3 postulaciones a vacantes activas. ' +
          'Para postularte a nuevas vacantes, alguna de tus postulaciones actuales debe inactivarse.',
      );
    }

    // Regla 4: La vacante debe tener cupo disponible
    const currentApplicants = await this.applicationRepository.count({
      where: { vacancyId: dto.vacancyId },
    });
    if (currentApplicants >= vacancy.maxApplicants) {
      throw new BadRequestException(
        `La vacante "${vacancy.title}" ha alcanzado su cupo máximo de ${vacancy.maxApplicants} aspirantes.`,
      );
    }

    const application = this.applicationRepository.create({
      userId,
      vacancyId: dto.vacancyId,
    });

    return this.applicationRepository.save(application);
  }

  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find({
      relations: ['user', 'vacancy'],
      order: { appliedAt: 'DESC' },
    });
  }

  async findMyApplications(userId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { userId },
      relations: ['vacancy', 'vacancy.technologies'],
      order: { appliedAt: 'DESC' },
    });
  }
}
