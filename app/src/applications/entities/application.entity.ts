import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';

/**
 * Entidad Application: registro de postulación de un Coder a una Vacante.
 * - La combinación (userId, vacancyId) es lógicamente única (validada en servicio).
 * - appliedAt: fecha automática de postulación para trazabilidad.
 */
@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  vacancyId: string;

  @CreateDateColumn()
  appliedAt: Date;

  @ManyToOne(() => User, (user) => user.applications, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications, { eager: false })
  @JoinColumn({ name: 'vacancyId' })
  vacancy: Vacancy;
}
