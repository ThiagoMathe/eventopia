import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as wppconnect from '@wppconnect-team/wppconnect';
import { join } from 'path';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync, unlinkSync, writeFileSync } from 'fs';

@Injectable()
export class WhatsappService implements OnModuleInit {

  private client?: wppconnect.Whatsapp;   // Define como opcional
  private readonly logger = new Logger(WhatsappService.name);

  async onModuleInit() {
    try {
      this.client = await wppconnect.create({
        session: 'eventopia-session',
      });
      this.logger.log('WhatsApp conectado!');
    } catch (error) {
      this.logger.error('Falha ao conectar no WhatsApp', error);
    }
  }

  async sendTicketMessage(phone: string, message: string, qrCodeBuffer: Buffer) {
    if (!this.client) return;

    const target = phone.includes('@c.us') ? phone : `${phone}@c.us`;
    
    // Cria um caminho absoluto para o arquivo temporário
    const tempFileName = `ticket-${Date.now()}.png`;
    const tempPath = join(process.cwd(), tempFileName);

    try {
      // Grava o Buffer no disco de forma síncrona
      writeFileSync(tempPath, qrCodeBuffer);
      this.logger.log(`Arquivo temporário criado: ${tempPath}`);

      // Envia o CAMINHO do arquivo
      await this.client.sendImage(
        target,
        tempPath, // passa o caminho real no Windows
        'ingresso.png',
        message,
      );

      this.logger.log('Ingresso enviado com sucesso!');

      // LIMPEZA: Espera 5 segundos antes de apagar 
      // Dá tempo do Puppeteer ler o arquivo
      setTimeout(() => {
        if (existsSync(tempPath)) {
          unlinkSync(tempPath);
          this.logger.debug(`Arquivo temporário removido: ${tempFileName}`);
        }
      }, 5000);

    } catch (error) {
      this.logger.error('Falha ao enviar imagem do ingresso:', error);
      // Tenta limpar em caso de erro também
      if (existsSync(tempPath)) unlinkSync(tempPath);
    }
  }
}