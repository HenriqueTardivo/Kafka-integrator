import { Injectable, Logger } from '@nestjs/common';
import { OrdersService } from '../../orders/orders.service';
import { OrdersGateway } from '../../websocket/orders.gateway';

type OrderItemMessage = {
  id: number;
  order_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  created_at: number;
};

@Injectable()
export class ItemsTopicService {
  private readonly logger = new Logger(ItemsTopicService.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async handleDelete(itemId: number, orderId: number): Promise<void> {
    const order = await this.ordersService.removeOrderItem(orderId, itemId);

    if (order) {
      this.ordersGateway.broadcastOrderUpdated(order);
      this.logger.log(`Item ${itemId} removed from order ${orderId}`);
    }
  }

  async handleCreateOrUpdate(data: OrderItemMessage): Promise<void> {
    try {
      const itemData = {
        item_id: data.id,
        order_id: data.order_id,
        product_name: data.product_name,
        quantity: data.quantity,
        unit_price: data.unit_price,
      };

      this.logger.log(
        `Processing item ${itemData.item_id} for order ${itemData.order_id}`,
      );

      const order = await this.ordersService.upsertOrderItem(itemData);
      if (order) {
        this.ordersGateway.broadcastOrderUpdated(order);
        this.logger.log(`Order ${order.order_id} item updated`);
      }
    } catch (error) {
      this.logger.error('Error handling order item event:', error);
      this.logger.error('Data received:', JSON.stringify(data));
    }
  }
}
