import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsPositive,
  IsOptional,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Modality } from '../../common/enums/modality.enum';
import { Location } from '../../common/enums/location.enum';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Desarrollador Full Stack Junior' })
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @ApiProperty({ example: 'Buscamos desarrollador para proyecto fintech...' })
  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;

  @ApiProperty({ example: 'Junior' })
  @IsString()
  @IsNotEmpty({ message: 'El seniority es obligatorio' })
  seniority: string;

  @ApiPropertyOptional({ example: 'Trabajo en equipo, comunicación efectiva' })
  @IsOptional()
  @IsString()
  softSkills: string;

  @ApiProperty({ enum: Location, example: Location.MEDELLIN })
  @IsEnum(Location, { message: 'La ubicación debe ser una ciudad válida' })
  location: Location;

  @ApiProperty({ enum: Modality, example: Modality.HYBRID })
  @IsEnum(Modality, { message: 'La modalidad debe ser remoto, hibrido o presencial' })
  modality: Modality;

  @ApiProperty({ example: '2.000.000 - 3.500.000 COP' })
  @IsString()
  @IsNotEmpty({ message: 'El rango salarial es obligatorio' })
  salaryRange: string;

  @ApiProperty({ example: 'Bancolombia S.A.' })
  @IsString()
  @IsNotEmpty({ message: 'La empresa es obligatoria' })
  company: string;

  @ApiProperty({ example: 10, description: 'Cupo máximo de aspirantes (obligatorio)' })
  @IsInt({ message: 'El cupo máximo debe ser un número entero' })
  @IsPositive({ message: 'El cupo máximo debe ser mayor a 0' })
  @Min(1)
  maxApplicants: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['Node.js', 'React', 'PostgreSQL'],
    description: 'Nombres de tecnologías requeridas',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies: string[];
}
