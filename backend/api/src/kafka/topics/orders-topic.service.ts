import { Injectable, Logger } from '@nestjs/common';
import { OrdersService } from '../../orders/orders.service';
import { OrdersGateway } from '../../websocket/orders.gateway';

type OrderMessage = {
  id: number;
  customer_name: string;
  order_date: number;
  total: number;
  created_at: number;
  updated_at: number;
};

@Injectable()
export class OrdersTopicService {
  private readonly logger = new Logger(OrdersTopicService.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async handleDelete(orderId: number): Promise<void> {
    await this.ordersService.deleteOrder(orderId);
    this.ordersGateway.broadcastOrderDeleted(orderId);
    this.logger.log(`Order ${orderId} deleted and broadcasted`);
  }

  async handleCreateOrUpdate(data: OrderMessage): Promise<void> {
    try {
      const orderDate =
        typeof data.order_date === 'number' && data.order_date < 100000
          ? new Date(data.order_date * 24 * 60 * 60 * 1000)
          : new Date(data.order_date);

      const orderData = {
        order_id: data.id,
        customer_name: data.customer_name,
        order_date: orderDate,
        total: data.total,
      };

      this.logger.log(
        `Processing order ${orderData.order_id} - Total: ${orderData.total}`,
      );

      const order = await this.ordersService.upsertOrderBase(orderData);
      if (order) {
        this.ordersGateway.broadcastOrderUpdated(order);
        this.logger.log(`Order ${order.order_id} synchronized to MongoDB`);
      }
    } catch (error) {
      this.logger.error('Error handling order event:', error);
      this.logger.error('Data received:', JSON.stringify(data));
    }
  }
}
