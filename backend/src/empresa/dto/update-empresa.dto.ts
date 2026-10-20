import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateEmpresaDto } from './create-empresa.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateEmpresaDto extends PartialType(
  OmitType(CreateEmpresaDto, ['senha'] as const),
) {
  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;
}
