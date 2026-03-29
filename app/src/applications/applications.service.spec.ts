import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';
import { VacanciesService } from '../vacancies/vacancies.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { Modality } from '../common/enums/modality.enum';
import { Location } from '../common/enums/location.enum';

/**
 * Pruebas unitarias de ApplicationsService.
 * Cubre las 4 reglas de negocio:
 * 1. Vacante inexistente → NotFoundException
 * 2. Vacante inactiva → BadRequestException
 * 3. Postulación duplicada → ConflictException
 * 4. Límite de 3 postulaciones activas → BadRequestException
 * 5. Cupo máximo alcanzado → BadRequestException
 */
describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let vacanciesService: jest.Mocked<VacanciesService>;

  const mockVacancy: Partial<Vacancy> = {
    id: 'vacancy-uuid-1',
    title: 'Backend Developer',
    maxApplicants: 5,
    isActive: true,
    location: Location.MEDELLIN,
    modality: Modality.REMOTE,
  };

  const mockQueryBuilder = {
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
  };

  const mockApplicationRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockVacanciesService = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findAllIncludingInactive: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationRepository,
        },
        {
          provide: VacanciesService,
          useValue: mockVacanciesService,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    vacanciesService = module.get(VacanciesService);

    jest.clearAllMocks();
    // Reset QueryBuilder
    mockApplicationRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.innerJoin.mockReturnThis();
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.andWhere.mockReturnThis();
  });

  const userId = 'user-uuid-1';
  const dto: CreateApplicationDto = { vacancyId: 'vacancy-uuid-1' };

  describe('apply', () => {
    it('debería crear postulación exitosamente cuando se cumplen todas las condiciones', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy as Vacancy);
      mockApplicationRepository.findOne.mockResolvedValue(null); // No ha aplicado
      mockQueryBuilder.getCount.mockResolvedValue(0); // 0 postulaciones activas
      mockApplicationRepository.count.mockResolvedValue(2); // 2 de 5 cupos tomados
      mockApplicationRepository.create.mockReturnValue({
        id: 'app-uuid-1',
        userId,
        vacancyId: dto.vacancyId,
      } as Application);
      mockApplicationRepository.save.mockResolvedValue({
        id: 'app-uuid-1',
        userId,
        vacancyId: dto.vacancyId,
        appliedAt: new Date(),
      } as Application);

      const result = await service.apply(dto, userId);

      expect(result.userId).toBe(userId);
      expect(result.vacancyId).toBe(dto.vacancyId);
      expect(mockApplicationRepository.save).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar NotFoundException si la vacante no existe', async () => {
      mockVacanciesService.findOne.mockRejectedValue(
        new NotFoundException('Vacante con id vacancy-uuid-1 no encontrada.'),
      );

      await expect(service.apply(dto, userId)).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException si la vacante está inactiva', async () => {
      const inactiveVacancy = { ...mockVacancy, isActive: false };
      mockVacanciesService.findOne.mockResolvedValue(inactiveVacancy as Vacancy);

      await expect(service.apply(dto, userId)).rejects.toThrow(
        new BadRequestException('La vacante no está disponible actualmente.'),
      );
    });

    it('debería lanzar ConflictException si el coder ya se postuló a esta vacante', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy as Vacancy);
      mockApplicationRepository.findOne.mockResolvedValue({
        id: 'existing-app',
        userId,
        vacancyId: dto.vacancyId,
      } as Application); // Ya existe postulación

      await expect(service.apply(dto, userId)).rejects.toThrow(
        new ConflictException('Ya te has postulado a esta vacante.'),
      );
    });

    it('debería lanzar BadRequestException si el coder tiene 3 o más postulaciones activas', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy as Vacancy);
      mockApplicationRepository.findOne.mockResolvedValue(null);
      mockQueryBuilder.getCount.mockResolvedValue(3); // Ya tiene 3 postulaciones activas

      await expect(service.apply(dto, userId)).rejects.toThrow(BadRequestException);
      await expect(service.apply(dto, userId)).rejects.toThrow(
        /límite máximo de 3 postulaciones/,
      );
    });

    it('debería lanzar BadRequestException si la vacante ya alcanzó cupo máximo', async () => {
      const fullVacancy = { ...mockVacancy, maxApplicants: 2 };
      mockVacanciesService.findOne.mockResolvedValue(fullVacancy as Vacancy);
      mockApplicationRepository.findOne.mockResolvedValue(null);
      mockQueryBuilder.getCount.mockResolvedValue(1); // Solo 1 postulación activa
      mockApplicationRepository.count.mockResolvedValue(2); // Cupo lleno (2/2)

      await expect(service.apply(dto, userId)).rejects.toThrow(BadRequestException);
      await expect(service.apply(dto, userId)).rejects.toThrow(
        /cupo máximo/,
      );
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las postulaciones con relaciones', async () => {
      const mockApps = [
        { id: 'app-1', userId: 'u1', vacancyId: 'v1' } as Application,
        { id: 'app-2', userId: 'u2', vacancyId: 'v1' } as Application,
      ];
      mockApplicationRepository.find.mockResolvedValue(mockApps);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockApplicationRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ relations: ['user', 'vacancy'] }),
      );
    });
  });

  describe('findMyApplications', () => {
    it('debería retornar solo las postulaciones del usuario autenticado', async () => {
      const myApps = [
        { id: 'app-1', userId, vacancyId: 'v1' } as Application,
      ];
      mockApplicationRepository.find.mockResolvedValue(myApps);

      const result = await service.findMyApplications(userId);

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe(userId);
      expect(mockApplicationRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId } }),
      );
    });
  });
});
