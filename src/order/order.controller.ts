import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthUser } from '../auth/auth.user.dec';
import { User } from '../types/user';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OrderModel } from 'src/types/dto/order.dto';


@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  listOrders(@AuthUser() { id }: User) {
    return this.orderService.listUserOrders(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createOrder(@Body() order: OrderModel, @AuthUser() user: User) {
    return this.orderService.placeOrder(order, user);
  }
}
