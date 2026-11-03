import { IsInt, IsNotEmpty, IsString, IsUrl, Min, MinLength } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsString()
  @IsUrl({ require_tld: false })
  imageUrl: string;

  @IsInt()
  @Min(1)
  costCoins: number;
}
