import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorador @Roles(...roles) para marcar qué roles pueden acceder a un endpoint.
 * Es leído por el RolesGuard para tomar la decisión de acceso.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
