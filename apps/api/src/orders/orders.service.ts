import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class OrdersService {

  async findAllByUser(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        // Traz os ingressos vinculados ao pedido
        orderTickets: {
          include: {
            ticket: {
              include: {
                event: true, // Traz os detalhes do evento (Título, Data, etc.)
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Os pedidos mais recentes aparecem primeiro
      },
    });
  }
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      let totalPrice = 0;
    
      const orderTicketsData: Prisma.OrderTicketCreateManyOrderInput[] = [];

      for (const item of dto.items) {
        // busca do ticket e validação de estoque

        const ticket = await tx.ticket.findUnique({
          where: { id: item.ticketId },
        });

        if (!ticket || ticket.quantity < item.quantity) {
          throw new BadRequestException(`Estoque insuficiente para: ${ticket?.name}`);
      }

        // 2. Lógica de preço (já está lá)
        totalPrice += Number(ticket.price) * item.quantity;

        // 3. Atualização do estoque (depois de validar tudo)
        await tx.ticket.update({
          where: { id: item.ticketId },
          data: {
          quantity: {
          decrement: item.quantity, // <--- Aqui o Prisma subtrai do banco de forma segura
            },
          },
        });

        for (let i = 0; i < item.quantity; i++) {
          orderTicketsData.push({
            ticketId: item.ticketId,
            qrCode: randomBytes(16).toString('hex'), 
          });
        }
      }
      // Criar o Pedido
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: 'PENDING',
          orderTickets: {
            create: orderTicketsData,
          },
        },
        include: {
          orderTickets: true,
        },
      });

      return order;
    });
  }
}