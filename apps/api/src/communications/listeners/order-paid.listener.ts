import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WhatsappService } from '../whatsapp.service';
import * as QRCode from 'qrcode';

@Injectable()
export class OrderPaidListener {
  private readonly logger = new Logger(OrderPaidListener.name);

  constructor(private whatsappService: WhatsappService) {}

  @OnEvent('order.paid')
  async handleOrderPaidEvent(payload: { order: any; userPhone: string }) {
    const { order, userPhone } = payload;
    
    this.logger.log(`Processando pedido: ${order.id}`);

    for (const item of order.orderTickets) {
      if (!item.qrCode) {
        this.logger.error(`O ingresso #${item.id} não possui um QR Code!`);
        continue; 
      }

      try {
        // Gera o Buffer do QR Code
        const qrCodeBuffer = await QRCode.toBuffer(item.qrCode);
        
        // Formata a data do evento (Ex: 04 de abril de 2026, 20:00)
        const eventDate = new Date(item.ticket.event.date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        // Usando os padrões de formatação do WhatsApp
        const message = 
          `✅ *PAGAMENTO CONFIRMADO* \n\n` +
          `Olá, *${order.user.name}*! \n` +
          `Sua presença está garantida no Eventopia. \n\n` +
          `📌 *EVENTO:* ${item.ticket.event.title}\n` +
          `📅 *DATA:* ${eventDate}\n` +
          `🎫 *TIPO:* ${item.ticket.name}\n` +
          `🆔 *PEDIDO:* #${order.id.substring(0, 8).toUpperCase()}\n\n` +
          `--- \n\n` +
          `📱 *INSTRUÇÕES:* \n` +
          `• Salve a imagem abaixo na sua galeria. \n` +
          `• Apresente este QR Code na entrada. \n` +
          `• _Este código é único e só pode ser lido uma vez._ \n\n` +
          `*Eventopia* ✨`;

        // Dispara no WhatsApp
        await this.whatsappService.sendTicketMessage(userPhone, message, qrCodeBuffer);
        
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Erro desconhecido';
        this.logger.error(`Erro no processamento do ingresso: ${errMsg}`);
      }
    }
  }
}