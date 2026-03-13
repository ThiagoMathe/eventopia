import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  public client: PrismaClient;
  constructor(config: ConfigService) {
    const connectionString = config.get<string>('DATABASE_URL');
    
    // Criamos um pool de conexão do driver 'pg'
    const pool = new Pool({ connectionString });
    
    // Criamos o adapter 
    const adapter = new PrismaPg(pool as any); // O PrismaPg espera um pool do 'pg', mas o PrismaClient espera um adapter, então fazemos essa ponte

    // Passamos o adapter para o construtor pai
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('💎 Eventopia: Conectado ao Postgres via Prisma 7 Adapter!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}