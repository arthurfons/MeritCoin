import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { MissionScope } from '@prisma/client';

export class CreateMissionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  rewardCoins: number;

  @IsEnum(MissionScope)
  scope: MissionScope;

  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @IsOptional()
  @IsBoolean()
  repeatable?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxPerWeek?: number;
}
