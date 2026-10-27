import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  @IsString()
  @IsNotEmpty()
  tradeName: string;

  @IsString()
  @Length(14, 18)
  cnpj: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
