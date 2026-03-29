import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { Technology } from './entities/technology.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Role } from '../common/enums/role.enum';

/**
 * VacanciesService: lógica de negocio para gestión de vacantes.
 * Punto clave: las tecnologías se resuelven por nombre usando findOrCreate,
 * evitando duplicados en la tabla de tecnologías.
 */
@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
    @InjectRepository(Technology)
    private readonly technologyRepository: Repository<Technology>,
  ) {}

  private async resolveTechnologies(names: string[]): Promise<Technology[]> {
    if (!names || names.length === 0) return [];

    const technologies: Technology[] = [];

    for (const name of names) {
      const normalized = name.trim();
      let tech = await this.technologyRepository.findOne({
        where: { name: normalized },
      });

      if (!tech) {
        tech = this.technologyRepository.create({ name: normalized });
        tech = await this.technologyRepository.save(tech);
      }

      technologies.push(tech);
    }

    return technologies;
  }

  async create(createVacancyDto: CreateVacancyDto): Promise<Vacancy> {
    const { technologies: techNames, ...vacancyData } = createVacancyDto;

    const technologies = await this.resolveTechnologies(techNames ?? []);

    const vacancy = this.vacancyRepository.create({
      ...vacancyData,
      technologies,
    });

    return this.vacancyRepository.save(vacancy);
  }

  async findAll(): Promise<Vacancy[]> {
    return this.vacancyRepository.find({
      where: { isActive: true },
      relations: ['technologies'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllIncludingInactive(): Promise<Vacancy[]> {
    return this.vacancyRepository.find({
      relations: ['technologies'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vacancy> {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id },
      relations: ['technologies'],
    });

    if (!vacancy) {
      throw new NotFoundException(`Vacante con id ${id} no encontrada.`);
    }

    return vacancy;
  }

  async update(
    id: string,
    updateVacancyDto: UpdateVacancyDto,
    userRole: string,
  ): Promise<Vacancy> {
    const vacancy = await this.findOne(id);

    // Solo Admin puede eliminar; Gestor puede editar campos regulares
    if (userRole === Role.CODER) {
      throw new ForbiddenException('Un Coder no puede modificar vacantes.');
    }

    const { technologies: techNames, ...updateData } = updateVacancyDto;

    if (techNames !== undefined) {
      vacancy.technologies = await this.resolveTechnologies(techNames);
    }

    Object.assign(vacancy, updateData);

    return this.vacancyRepository.save(vacancy);
  }

  async remove(id: string): Promise<{ message: string }> {
    const vacancy = await this.findOne(id);
    await this.vacancyRepository.remove(vacancy);
    return { message: `Vacante "${vacancy.title}" eliminada exitosamente.` };
  }
}
