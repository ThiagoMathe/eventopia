import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Patch, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateEventDto } from './dto/update-event.dto';
import { FindEventsDto } from './dto/find-events.dto';

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

  @Get()
  findAll(@Query() filters: FindEventsDto = {}) {
    return this.eventsService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
  // req.user contém o que retorna na JwtStrategy: { sub, email, role }
    return this.eventsService.remove(id, req.user.sub, req.user.role);
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Request() req,
  ) {
  return this.eventsService.update(id, dto, req.user.sub, req.user.role);
  }
}