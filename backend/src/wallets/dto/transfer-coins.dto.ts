import { IsInt, IsNotEmpty, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class TransferCoinsDto {
  @IsUUID()
  studentId: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  message: string;
}
