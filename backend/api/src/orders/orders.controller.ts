import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../schemas/order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order | null> {
    return this.ordersService.findOne(parseInt(id));
  }

  @Post()
  async create(@Body() orderData: Partial<Order>): Promise<Order> {
    return this.ordersService.create(orderData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.ordersService.deleteOrder(parseInt(id));
  }
}
