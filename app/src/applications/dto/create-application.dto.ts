import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID de la vacante a la que se postula',
  })
  @IsUUID('4', { message: 'El vacancyId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El vacancyId es obligatorio' })
  vacancyId: string;
}
