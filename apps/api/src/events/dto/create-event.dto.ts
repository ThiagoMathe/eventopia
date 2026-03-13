import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString() @IsNotEmpty()
  title: string;

  @IsString() @IsNotEmpty()
  description: string;

  @IsDateString() @IsNotEmpty()
  date: string;

  @IsString() @IsNotEmpty()
  location: string;

  @IsString() @IsOptional()
  image?: string;
}