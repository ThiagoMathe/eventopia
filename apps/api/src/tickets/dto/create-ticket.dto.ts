import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsInt, 
  Min, 
  MinLength 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do ingresso é obrigatório (ex: VIP, Pista).' })
  @MinLength(3, { message: 'O nome do ingresso deve ter pelo menos 3 caracteres.' })
  name: string;

  @Type(() => Number) // Garante que o valor do JSON seja tratado como número
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O preço deve ser um número válido com até 2 casas decimais.' })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  price: number;

  @Type(() => Number)
  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade mínima de ingressos é 1.' })
  quantity: number;

  @IsString()
  @IsNotEmpty({ message: 'O ID do evento é obrigatório para vincular o ingresso.' })
  eventId: string;
}