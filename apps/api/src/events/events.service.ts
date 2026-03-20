import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto, organizerId: string) {
    return this.prisma.event.create({
      data: {
        ...dto,
        organizerId,
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      include: { organizer: { select: { name: true } } }, // Traz o nome do dono
    });
  }

  async findAllByOrganizer(organizerId: string) {
    return this.prisma.event.findMany({
      where: { 
      organizerId // Filtra apenas os eventos deste organizador
      },
    include: { 
      organizer: { select: { name: true } } 
      },
    orderBy: { 
      createdAt: 'desc' // Mostra os mais recentes primeiro
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Evento não encontrado');
    return event;
  }

  async remove(id: string, userId: string, userRole: string) {
    // Bloqueio imediato para USER
    if (userRole === 'USER') {
      throw new ForbiddenException('Usuários comuns não têm permissão para excluir eventos.');
    }

  // Se for ADMIN, deleta sem perguntar de quem é
  if (userRole === 'ADMIN') {
    try {
      return await this.prisma.event.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException('Evento não encontrado para exclusão.');
    }
  }

  // Se for ORGANIZER, precisa ser o dono
  const event = await this.prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new NotFoundException('Evento não encontrado.');
  }

  if (event.organizerId !== userId) {
    throw new ForbiddenException('Você só pode excluir os seus próprios eventos.');
  }

  return this.prisma.event.delete({ where: { id } });
  }

  async update(id: string, dto: UpdateEventDto, userId: string, userRole: string) {
    // Bloqueio para USER
    if (userRole === 'USER') {
      throw new ForbiddenException('Apenas organizadores podem editar eventos.');
    }

    // Busca o evento para verificar o dono
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    // Se não for ADMIN e não for o DONO, bloqueia
    if (userRole !== 'ADMIN' && event.organizerId !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este evento.');
    }

    // Update parcial (O Prisma ignora campos undefined no dto)
    return this.prisma.event.update({
      where: { id },
      data: dto,
    });
}
}