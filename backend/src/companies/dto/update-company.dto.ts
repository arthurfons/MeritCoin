import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  tradeName?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
