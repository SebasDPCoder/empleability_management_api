import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { Vacancy } from './vacancy.entity';

/**
 * Entidad Technology: representa una tecnología (ej: React, Node.js).
 * Se relaciona con Vacancy en una relación ManyToMany para poder
 * filtrar vacantes por tecnología y generar métricas.
 */
@Entity('technologies')
export class Technology {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Vacancy, (vacancy) => vacancy.technologies)
  vacancies: Vacancy[];
}
