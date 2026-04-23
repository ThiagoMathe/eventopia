import * as dotenv from 'dotenv';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos do JSON que não estão no DTO (Segurança)
      forbidNonWhitelisted: true, // Retorna erro se tentarem enviar campos extras
      transform: true, // Converte tipos automaticamente (ex: string para número ou data)
    }),
  );
  
  app.enableCors();

  await app.listen(3000);
  console.log('🚀 Eventopia API rodando em: http://localhost:3000');
}
bootstrap();