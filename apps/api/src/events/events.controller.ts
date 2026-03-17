import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Rota para ver APENAS os meus eventos
  @UseGuards(JwtAuthGuard)
  @Get('me') 
  findMyEvents(@Request() req) {
    // Chamando o método no Service
    return this.eventsService.findAllByOrganizer(req.user.sub);
  }

  // Rota pública para ver TODOS os eventos (Feed)
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateEventDto, @Request() req) {
    return this.eventsService.create(dto, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }
}