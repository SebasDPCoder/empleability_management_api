import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { Application } from '../../applications/entities/application.entity';

/**
 * Entidad User: representa a cualquier usuario del sistema.
 * - role: determina los permisos (admin, gestor, coder).
 * - password: almacenada en hash bcrypt, nunca en texto plano.
 * - select: false en password para no exponerla en queries por defecto.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CODER,
  })
  role: Role;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];
}
