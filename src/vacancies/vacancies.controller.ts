import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Vacancies')
@ApiBearerAuth()
@ApiHeader({ name: 'x-api-key', required: true })
@UseGuards(JwtAuthGuard, ApiKeyGuard)
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.GESTOR)
  @ApiOperation({ summary: 'Crear vacante (Admin/Gestor)' })
  @ApiResponse({ status: 201, description: 'Vacante creada exitosamente.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar vacantes activas (todos los roles)' })
  @ApiResponse({ status: 200, description: 'Lista de vacantes activas.' })
  findAll() {
    return this.vacanciesService.findAll();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.GESTOR)
  @ApiOperation({ summary: 'Listar todas las vacantes incluyendo inactivas (Admin/Gestor)' })
  findAllIncludingInactive() {
    return this.vacanciesService.findAllIncludingInactive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener vacante por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Vacante encontrada.' })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.GESTOR)
  @ApiOperation({
    summary: 'Actualizar vacante (Admin/Gestor) — incluye activar/inactivar',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Vacante actualizada.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVacancyDto: UpdateVacancyDto,
    @Request() req,
  ) {
    return this.vacanciesService.update(id, updateVacancyDto, req.user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar vacante (Solo Admin)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Vacante eliminada.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vacanciesService.remove(id);
  }
}
