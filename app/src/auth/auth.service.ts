import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

/**
 * AuthService: maneja el ciclo de autenticación.
 * - register: crea un usuario con rol coder por defecto.
 * - login: valida credenciales y emite un JWT firmado con los datos del usuario.
 * - El password nunca se retorna en respuestas, solo se almacena como hash.
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Verificar que el email no esté registrado
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: Role.CODER,
    });

    return {
      message: 'Usuario registrado exitosamente',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(dto: LoginDto) {
    // Necesitamos el password (select: false en entidad, usamos método especial)
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'Inicio de sesión exitoso',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
