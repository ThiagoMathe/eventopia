import { IsOptional, IsString } from 'class-validator';

export class FindEventsDto {
  @IsOptional()
  @IsString()
  search?: string; // Busca no título ou descrição

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  category?: string;
}