import { IsString, IsNotEmpty, IsOptional, IsUrl, MinLength, Matches, IsDate, MinDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @MinLength(5, { message: 'O título deve ter pelo menos 5 caracteres.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @Type(() => Date) // Converte a string do JSON para um objeto Date
  @IsDate({ message: 'A data deve ser um formato válido.' })
  @MinDate(new Date(), { message: 'A data do evento não pode ser no passado.' })
  date: Date;

  @IsString()
  @IsNotEmpty({ message: 'O local do evento é obrigatório.' })
  location: string;

  @IsOptional()
  @IsUrl({}, { message: 'A imagem deve ser uma URL válida.' })
  image?: string;

  @IsString()
  @IsNotEmpty({ message: 'O slug é obrigatório.' })
  @Matches(/^[a-z0-9-]+$/, { 
    message: 'O slug deve conter apenas letras minúsculas, números e hifens (ex: meu-evento-2026).' 
  })
  slug: string;
}