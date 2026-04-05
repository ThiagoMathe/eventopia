import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
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
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

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
    // Busca o pedido com os relacionamentos necessários
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { 
        orderTickets: true, 
        user: { select: { name: true, phone: true } } // Pegamos o telefone do usuário aqui
      },
    });

    if (!order) throw new BadRequestException('Pedido não encontrado.');
    if (order.status !== 'PENDING') {
      throw new BadRequestException('Apenas pedidos PENDENTES podem ter o status alterado.');
    }

    if (status === 'CANCELLED') {
      return this.prisma.$transaction(async (tx) => {
        for (const item of order.orderTickets) {
          await tx.ticket.update({
            where: { id: item.ticketId },
            data: { quantity: { increment: 1 } },
          });
        }
        return tx.order.update({
          where: { id },
          data: { status: 'CANCELLED' },
        });
      });
    }

    // LÓGICA PARA PAGAMENTO
    if (status === 'PAID') {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status: 'PAID' },
        include: { 
          user: true,
          orderTickets: {
            include: {
              ticket: {
                include: {
                  event: true // Pegamos o evento para saber o título e a data
                }
              }
            }
          },
        }
      });

      // Disparamos o evento para o módulo de comunicação (WhatsApp)
      // Isso acontece de forma assíncrona, não trava o retorno da API!
      this.eventEmitter.emit('order.paid', {
        order: updatedOrder,
        userPhone: updatedOrder.user.phone,
      });

      return updatedOrder;
    }
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
  
  async checkIn(qrCode: string, userId: string, userRole: string) {
    // Busca o ingresso e traz dados do evento para validar permissões
    const orderTicket = await this.prisma.orderTicket.findUnique({
      where: { qrCode },
      include: {
        order: true,
        ticket: {
          include: { event: true }
        }
      }
    });

    if (!orderTicket) {
      throw new NotFoundException('Ingresso não encontrado ou inválido.');
    }

    // Só entra se estiver PAGO
    if (orderTicket.order.status !== 'PAID') {
      throw new BadRequestException('Não é possível fazer check-in de um pedido pendente ou cancelado.');
    }

    // Validação de fraude: Já foi usado?
    if (orderTicket.usedAt) {
      throw new BadRequestException(`Este ingresso já foi utilizado em: ${orderTicket.usedAt.toLocaleString()}`);
    }

    // Segurança de cargo: Organizador só valida os PRÓPRIOS eventos
    if (userRole === 'ORGANIZER' && orderTicket.ticket.event.organizerId !== userId) {
      throw new ForbiddenException('Você não tem permissão para validar ingressos de outros organizadores.');
    }

    // Marca a data de uso
    return this.prisma.orderTicket.update({
      where: { qrCode },
      data: { usedAt: new Date() },
    });
  }
}