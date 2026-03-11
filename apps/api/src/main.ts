import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega o .env da pasta apps/api de forma absoluta
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('🚀 Eventopia API rodando em: http://localhost:3000');
}
bootstrap();