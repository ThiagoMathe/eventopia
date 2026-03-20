import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  private async validateOwnership(ticketId: string, userId: string, userRole: string) {
    // Admin sempre passa
    if (userRole === 'ADMIN') return;

    // Busca o ticket e "traz" o evento junto (Join)
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { event: true }, // Aqui pegamos o organizerId que está no Evento
    });

    if (!ticket) {
      throw new NotFoundException('Ingresso não encontrado.');
    }

    // Verifica se o dono do evento é o mesmo que está logado
    if (ticket.event.organizerId !== userId) {
      throw new ForbiddenException('Você não tem permissão para alterar ingressos deste evento.');
    }
  }

  async create(dto: CreateTicketDto, userId: string, userRole: string) {
    if (userRole === 'USER') {
      throw new ForbiddenException('Usuários comuns não podem criar ingressos.');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new NotFoundException(`Evento com ID ${dto.eventId} não encontrado.`);
    }

    if (userRole !== 'ADMIN' && event.organizerId !== userId) {
      throw new ForbiddenException('Você não tem permissão para criar ingressos neste evento.');
    }

    return this.prisma.ticket.create({
      data: {
        name: dto.name,
        price: dto.price,
        quantity: dto.quantity,
        eventId: dto.eventId,
      },
    });
  }

  async update(id: string, dto: UpdateTicketDto, userId: string, userRole: string) {
    if (userRole === 'USER') throw new ForbiddenException('Ação não permitida.');
    
    await this.validateOwnership(id, userId, userRole);

    return this.prisma.ticket.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    if (userRole === 'USER') throw new ForbiddenException('Ação não permitida.');
    
    await this.validateOwnership(id, userId, userRole);

    return this.prisma.ticket.delete({
      where: { id },
    });
  }

  findAllByEvent(eventId: string) {
    return this.prisma.ticket.findMany({
      where: { eventId },
    });
  }
}