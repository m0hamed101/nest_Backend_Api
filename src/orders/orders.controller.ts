import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Roles } from '../auth/jwt/roles.decorator';
import { Role } from '../auth/jwt/role.enum';
import { RolesGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('orders')
@UseGuards(RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOrderById(@Param('id') id: number) {
    return this.ordersService.findOrderById(id);
  }

  @Patch(':id/status')
  @Roles(Role.Admin)
  updateOrderStatus(@Param('id') id: number, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  removeOrder(@Param('id') id: number) {
    return this.ordersService.removeOrder(id);
  }
}
