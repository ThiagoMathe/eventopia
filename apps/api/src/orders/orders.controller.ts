import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

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

  @UseGuards(JwtAuthGuard, RolesGuard) // Certifique-se de que há uma vírgula entre os Guards
  @Roles(Role.ADMIN) // <--- O "@" É OBRIGATÓRIO AQUI
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'PAID' | 'CANCELLED'
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}

