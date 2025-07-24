import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  company: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  jobType?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  salary?: string;
}
