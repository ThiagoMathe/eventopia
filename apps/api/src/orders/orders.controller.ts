import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    // req.user.sub é o ID do usuário que extraímos do Token JWT
    return this.ordersService.create(createOrderDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  findAllMyOrders(@Request() req) {
    // Rota para o usuário ver apenas os pedidos dele
    return this.ordersService.findAllByUser(req.user.sub);
  }
}