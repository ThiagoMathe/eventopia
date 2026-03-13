import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

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

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Evento não encontrado');
    return event;
  }

  async remove(id: string, organizerId: string) {
    // Só deleta se o evento for do organizador que está pedindo
    return this.prisma.event.delete({
      where: { id, organizerId },
    });
  }
}