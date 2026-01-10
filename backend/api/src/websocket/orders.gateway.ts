import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../schemas/order.schema';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class OrdersGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrdersGateway.name);

  constructor(private readonly ordersService: OrdersService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getOrders')
  async handleGetOrders(client: Socket): Promise<void> {
    try {
      const orders = await this.ordersService.findAll();
      client.emit('orders', orders);
    } catch (error) {
      this.logger.error('Error fetching orders:', error);
      client.emit('error', { message: 'Failed to fetch orders' });
    }
  }

  @SubscribeMessage('getOrder')
  async handleGetOrder(
    client: Socket,
    payload: { orderId: number },
  ): Promise<void> {
    try {
      const order = await this.ordersService.findOne(payload.orderId);
      client.emit('order', order);
    } catch (error) {
      this.logger.error(`Error fetching order ${payload.orderId}:`, error);
      client.emit('error', { message: 'Failed to fetch order' });
    }
  }

  // Broadcast order update to all connected clients
  broadcastOrderUpdate(order: Order) {
    this.logger.log(`Broadcasting update for order ${order.order_id}`);
    this.server.emit('orderUpdate', order);
  }

  // Broadcast order creation to all connected clients
  broadcastOrderCreated(order: Order) {
    this.logger.log(`Broadcasting new order ${order.order_id}`);
    this.server.emit('orderCreated', order);
  }

  // Broadcast order deletion to all connected clients
  broadcastOrderDeleted(orderId: number) {
    this.logger.log(`Broadcasting deletion of order ${orderId}`);
    this.server.emit('orderDeleted', { orderId });
  }
}
