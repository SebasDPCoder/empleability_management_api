import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateVacancyDto } from './create-vacancy.dto';

/**
 * UpdateVacancyDto extiende PartialType(CreateVacancyDto), haciendo
 * todos los campos opcionales. Agrega isActive para activar/inactivar.
 */
export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {
  @ApiPropertyOptional({
    example: false,
    description: 'Activar o inactivar la vacante',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
