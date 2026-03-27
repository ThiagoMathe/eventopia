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

        totalPrice += Number(ticket.price) * item.quantity;

        // Atualização do estoque (depois de validar tudo)
        await tx.ticket.update({
          where: { id: item.ticketId },
          data: {
          quantity: {
          decrement: item.quantity, // Prisma subtrai do banco de forma segura
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

  async updateStatus(id: string, status: 'PAID' | 'CANCELLED') {
    // Busca o pedido para verificar se ele existe e qual o status atual
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderTickets: true }, // Precisamos dos itens para devolver ao estoque se cancelar
    });

    if (!order) {
      throw new BadRequestException('Pedido não encontrado.');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException('Apenas pedidos PENDENTES podem ter o status alterado.');
    }

    // Se o novo status for CANCELADO, devolvemos os itens para o estoque
    if (status === 'CANCELLED') {
      return this.prisma.$transaction(async (tx) => {
        // Para cada ingresso que estava no pedido, somamos de volta no Ticket original
        for (const item of order.orderTickets) {
          await tx.ticket.update({
            where: { id: item.ticketId },
            data: {
              quantity: {
                increment: 1, // Devolvemos 1 por 1 conforme a lista de ingressos gerados
              },
            },
          });
        }

        // Atualizamos o status do pedido para CANCELADO
        return tx.order.update({
          where: { id },
          data: { status: 'CANCELLED' },
        });
      });
    }

    // Se o status for PAGO, apenas atualizamos o registro
    return this.prisma.order.update({
      where: { id },
      data: { status: 'PAID' },
    });
  }



  async getAdminStats() {
    // Somar o totalPrice de todos os pedidos PAGOS
    const revenue = await this.prisma.order.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        status: 'PAID',
      },
    });

    // Contar quantos ingressos individuais (OrderTickets) foram vendidos em pedidos PAGOS
    const ticketsSold = await this.prisma.orderTicket.count({
      where: {
        order: {
          status: 'PAID',
        },
      },
    });

    return {
      totalRevenue: revenue._sum.totalPrice || 0,
      totalTicketsSold: ticketsSold,
    };
  }
}