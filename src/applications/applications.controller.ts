import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiSecurity,
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Applications')
@ApiBearerAuth('JWT')
@ApiSecurity('ApiKey')
@ApiHeader({ name: 'x-api-key', required: true })
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.CODER)
  @ApiOperation({
    summary: 'Postularse a una vacante (Solo Coder)',
    description:
      'Un coder puede postularse máximo a 3 vacantes activas. No puede postularse dos veces ni a vacantes sin cupo.',
  })
  @ApiResponse({ status: 201, description: 'Postulación registrada.' })
  @ApiResponse({ status: 400, description: 'Sin cupo o límite de postulaciones.' })
  @ApiResponse({ status: 409, description: 'Ya estás postulado a esta vacante.' })
  apply(@Body() dto: CreateApplicationDto, @Request() req) {
    return this.applicationsService.apply(dto, req.user.userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.GESTOR)
  @ApiOperation({ summary: 'Listar todas las postulaciones (Admin/Gestor)' })
  @ApiResponse({ status: 200, description: 'Lista de postulaciones.' })
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get('me')
  @Roles(Role.CODER)
  @ApiOperation({ summary: 'Ver mis postulaciones (Coder)' })
  @ApiResponse({ status: 200, description: 'Mis postulaciones.' })
  findMyApplications(@Request() req) {
    return this.applicationsService.findMyApplications(req.user.userId);
  }
}
