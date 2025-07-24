import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @Length(1, 500)
  cvLink?: string;

  @IsString()
  @IsOptional()
  coverLetter?: string;

  @IsUUID()
  @IsNotEmpty()
  jobId: string;
}
