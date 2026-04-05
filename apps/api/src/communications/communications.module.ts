import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { OrderPaidListener } from './listeners/order-paid.listener';

@Module({
  providers: [WhatsappService, OrderPaidListener]
})
export class CommunicationsModule {}
