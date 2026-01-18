import { Injectable, Logger } from '@nestjs/common';
import { OrdersService } from '../../orders/orders.service';
import { OrdersGateway } from '../../websocket/orders.gateway';

type StatusHistoryMessage = {
  id: number;
  order_id: number;
  status_id: number;
  changed_at: number;
  notes: string;
};

@Injectable()
export class StatusTopicService {
  private readonly logger = new Logger(StatusTopicService.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async handleDelete(statusHistoryId: number): Promise<void> {
    this.logger.log(`Status history ${statusHistoryId} deleted`);
  }

  async handleCreateOrUpdate(data: StatusHistoryMessage): Promise<void> {
    try {
      this.logger.log(`Processing status change for order ${data.order_id}`);

      const updatedOrder = await this.ordersService.updateOrderStatus(
        data.order_id,
        data.status_id,
        new Date(data.changed_at / 1000),
        data.notes,
      );

      if (!updatedOrder) {
        return;
      }

      if (this.deletedStatus(updatedOrder.current_status)) {
        this.ordersGateway.broadcastOrderDeleted(data.order_id);
        this.logger.log(
          `Order ${data.order_id} marked as ${updatedOrder.current_status} and removed from list`,
        );
        return;
      }

      this.ordersGateway.broadcastOrderUpdated(updatedOrder);
      this.logger.log(`Order ${data.order_id} status updated and broadcasted`);
    } catch (error) {
      this.logger.error('Error handling status history event:', error);
      this.logger.error('Data received:', JSON.stringify(data));
    }
  }

  private deletedStatus(current_status?: string): boolean {
    return current_status === 'dispatched' || current_status === 'cancelled';
  }
}
