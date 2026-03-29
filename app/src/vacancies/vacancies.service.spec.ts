import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacanciesService } from './vacancies.service';
import { Vacancy } from './entities/vacancy.entity';
import { Technology } from './entities/technology.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { Modality } from '../common/enums/modality.enum';
import { Location } from '../common/enums/location.enum';

/**
 * Pruebas unitarias de VacanciesService.
 * Se usan repositorios mock para aislar la capa de servicio de la base de datos.
 * Esto sigue el principio de inversión de dependencias (SOLID).
 */
describe('VacanciesService', () => {
  let service: VacanciesService;
  let vacancyRepository: jest.Mocked<Repository<Vacancy>>;
  let technologyRepository: jest.Mocked<Repository<Technology>>;

  const mockVacancy: Partial<Vacancy> = {
    id: 'vacancy-uuid-1',
    title: 'Full Stack Developer',
    description: 'Desarrollador Full Stack para proyecto fintech',
    seniority: 'Junior',
    location: Location.MEDELLIN,
    modality: Modality.HYBRID,
    salaryRange: '2.000.000 - 3.500.000 COP',
    company: 'Bancolombia',
    maxApplicants: 10,
    isActive: true,
    technologies: [],
    createdAt: new Date(),
  };

  const mockVacancyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockTechnologyRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        {
          provide: getRepositoryToken(Vacancy),
          useValue: mockVacancyRepository,
        },
        {
          provide: getRepositoryToken(Technology),
          useValue: mockTechnologyRepository,
        },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
    vacancyRepository = module.get(getRepositoryToken(Vacancy));
    technologyRepository = module.get(getRepositoryToken(Technology));

    // Reset all mocks between tests
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear una vacante exitosamente sin tecnologías', async () => {
      const createDto: CreateVacancyDto = {
        title: 'Full Stack Developer',
        description: 'Desarrollador para fintech',
        seniority: 'Junior',
        location: Location.MEDELLIN,
        modality: Modality.HYBRID,
        salaryRange: '2.000.000 - 3.500.000 COP',
        company: 'Bancolombia',
        maxApplicants: 10,
        technologies: [],
        softSkills: '',
      };

      mockVacancyRepository.create.mockReturnValue(mockVacancy as Vacancy);
      mockVacancyRepository.save.mockResolvedValue(mockVacancy as Vacancy);

      const result = await service.create(createDto);

      expect(vacancyRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: createDto.title,
          maxApplicants: createDto.maxApplicants,
        }),
      );
      expect(vacancyRepository.save).toHaveBeenCalledTimes(1);
      expect(result.title).toBe('Full Stack Developer');
    });

    it('debería crear una vacante y resolver tecnologías nuevas', async () => {
      const createDto: CreateVacancyDto = {
        title: 'Backend Developer',
        description: 'Desarrollador backend',
        seniority: 'Mid',
        location: Location.BOGOTA,
        modality: Modality.REMOTE,
        salaryRange: '3.000.000 - 5.000.000 COP',
        company: 'Rappi',
        maxApplicants: 5,
        technologies: ['Node.js', 'PostgreSQL'],
        softSkills: 'Trabajo en equipo',
      };

      const mockTech1 = { id: 'tech-1', name: 'Node.js' };
      const mockTech2 = { id: 'tech-2', name: 'PostgreSQL' };

      // Primera tecnología no existe, segunda tampoco
      mockTechnologyRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockTechnologyRepository.create
        .mockReturnValueOnce(mockTech1 as Technology)
        .mockReturnValueOnce(mockTech2 as Technology);
      mockTechnologyRepository.save
        .mockResolvedValueOnce(mockTech1 as Technology)
        .mockResolvedValueOnce(mockTech2 as Technology);

      const vacancyWithTechs = { ...mockVacancy, technologies: [mockTech1, mockTech2] };
      mockVacancyRepository.create.mockReturnValue(vacancyWithTechs as Vacancy);
      mockVacancyRepository.save.mockResolvedValue(vacancyWithTechs as Vacancy);

      const result = await service.create(createDto);

      expect(technologyRepository.findOne).toHaveBeenCalledTimes(2);
      expect(technologyRepository.save).toHaveBeenCalledTimes(2);
      expect(result.technologies).toHaveLength(2);
    });

    it('debería reutilizar tecnologías existentes (no crear duplicados)', async () => {
      const createDto: CreateVacancyDto = {
        title: 'React Developer',
        description: 'Frontend developer',
        seniority: 'Senior',
        location: Location.BARRANQUILLA,
        modality: Modality.IN_PERSON,
        salaryRange: '5.000.000 - 8.000.000 COP',
        company: 'Empresa ABC',
        maxApplicants: 3,
        technologies: ['React'],
        softSkills: '',
      };

      const existingTech = { id: 'tech-react', name: 'React' };

      // La tecnología YA existe en la base de datos
      mockTechnologyRepository.findOne.mockResolvedValue(existingTech as Technology);

      mockVacancyRepository.create.mockReturnValue(mockVacancy as Vacancy);
      mockVacancyRepository.save.mockResolvedValue(mockVacancy as Vacancy);

      await service.create(createDto);

      // No debe crear la tecnología, solo reutilizarla
      expect(technologyRepository.create).not.toHaveBeenCalled();
      expect(technologyRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería retornar solo vacantes activas', async () => {
      const activeVacancies = [mockVacancy as Vacancy];
      mockVacancyRepository.find.mockResolvedValue(activeVacancies);

      const result = await service.findAll();

      expect(vacancyRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } }),
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debería retornar una vacante por ID', async () => {
      mockVacancyRepository.findOne.mockResolvedValue(mockVacancy as Vacancy);

      const result = await service.findOne('vacancy-uuid-1');

      expect(result.id).toBe('vacancy-uuid-1');
    });

    it('debería lanzar NotFoundException si la vacante no existe', async () => {
      mockVacancyRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Vacante con id non-existent-id no encontrada.',
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar una vacante y retornar mensaje de confirmación', async () => {
      mockVacancyRepository.findOne.mockResolvedValue(mockVacancy as Vacancy);
      mockVacancyRepository.remove.mockResolvedValue(mockVacancy as Vacancy);

      const result = await service.remove('vacancy-uuid-1');

      expect(vacancyRepository.remove).toHaveBeenCalledTimes(1);
      expect(result.message).toContain('eliminada exitosamente');
    });
  });
});
