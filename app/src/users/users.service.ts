import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../common/enums/role.enum';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

/**
 * UsersService: capa de acceso a datos para usuarios.
 * - findByEmail: búsqueda sin password (uso general).
 * - findByEmailWithPassword: incluye el campo password para autenticación.
 * - El password tiene select:false en la entidad, así que hay que seleccionarlo
 *   explícitamente con addSelect cuando se necesita (login).
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado.`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
