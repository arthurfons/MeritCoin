import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateAlunoDto } from './create-aluno.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAlunoDto extends PartialType(
  OmitType(CreateAlunoDto, ['senha'] as const),
) {
  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;
}
