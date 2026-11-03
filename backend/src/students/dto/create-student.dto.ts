import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';

/** Cadastro pela escola (enunciado + extras). */
export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(11, 14)
  cpf: string;

  @IsString()
  @IsNotEmpty()
  rg: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @Length(2, 2)
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsString()
  studentNumber?: string;

  @IsOptional()
  @IsString()
  gradeYear?: string;

  @IsOptional()
  @IsUUID()
  classId?: string;
}
