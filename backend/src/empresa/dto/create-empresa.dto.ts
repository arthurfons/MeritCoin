import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @Length(14, 18)
  cnpj: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @MinLength(6)
  senha: string;
}
