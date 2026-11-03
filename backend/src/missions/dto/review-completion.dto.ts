import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MissionCompletionStatus } from '@prisma/client';

export class ReviewCompletionDto {
  @IsEnum(MissionCompletionStatus)
  status: Extract<MissionCompletionStatus, 'APPROVED' | 'REJECTED'>;

  @IsOptional()
  @IsString()
  note?: string;
}
