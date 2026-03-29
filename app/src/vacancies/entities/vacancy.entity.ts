import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Modality } from '../../common/enums/modality.enum';
import { Location } from '../../common/enums/location.enum';
import { Technology } from './technology.entity';
import { Application } from '../../applications/entities/application.entity';

/**
 * Entidad Vacancy: representa una vacante laboral publicada por un Gestor.
 * - technologies: relación ManyToMany con Technology (tabla de cruce generada con @JoinTable).
 * - maxApplicants: define el cupo máximo antes de cerrar postulaciones.
 * - isActive: permite activar/inactivar una vacante sin eliminarla.
 */
@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  seniority: string;

  @Column({ nullable: true })
  softSkills: string;

  @Column({
    type: 'enum',
    enum: Location,
  })
  location: Location;

  @Column({
    type: 'enum',
    enum: Modality,
  })
  modality: Modality;

  @Column()
  salaryRange: string;

  @Column()
  company: string;

  @Column()
  maxApplicants: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Technology, (technology) => technology.vacancies, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'vacancy_technologies',
    joinColumn: { name: 'vacancy_id' },
    inverseJoinColumn: { name: 'technology_id' },
  })
  technologies: Technology[];

  @OneToMany(() => Application, (application) => application.vacancy)
  applications: Application[];
}
