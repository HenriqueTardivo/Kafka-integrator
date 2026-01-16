import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { OrdersService } from '../orders/orders.service';
import { OrdersGateway } from '../websocket/orders.gateway';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private consumer: Consumer;

  private readonly topics = {
    orders: process.env.KAFKA_TOPIC_ORDERS || 'erp.public.orders',
    orderItems: process.env.KAFKA_TOPIC_ORDER_ITEMS || 'erp.public.order_items',
    orderStatusHistory:
      process.env.KAFKA_TOPIC_STATUS || 'erp.public.order_status_history',
  };

  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersGateway: OrdersGateway,
  ) {
    this.kafka = new Kafka({
      clientId: 'nestjs-consumer',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.consumer = this.kafka.consumer({
      groupId: 'order-management-consumer-group',
    });
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      await this.consumer.connect();
      this.logger.log('Kafka consumer connected');

      await this.consumer.subscribe({
        topics: [
          this.topics.orders,
          this.topics.orderItems,
          this.topics.orderStatusHistory,
        ],
        fromBeginning: false,
      });

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });

      this.logger.log(
        `Kafka consumer started - subscribed to: ${Object.values(this.topics).join(', ')}`,
      );
    } catch (error) {
      this.logger.error('Error connecting to Kafka:', error);
    }
  }

  private async disconnect() {
    try {
      await this.consumer.disconnect();
      this.logger.log('Kafka consumer disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting from Kafka:', error);
    }
  }

  private async handleMessage(payload: EachMessagePayload) {
    const { topic, partition, message } = payload;

    try {
      const value = message.value?.toString();
      if (!value) return;

      this.logger.log(
        `Received message from topic ${topic}, partition ${partition}`,
      );

      const debeziumEvent = JSON.parse(value);
      const { op, after, before } = debeziumEvent.payload || debeziumEvent;

      switch (topic) {
        case this.topics.orders:
          await this.handleOrderEvent(op, after, before);
          break;
        case this.topics.orderItems:
          await this.handleOrderItemEvent(op, after, before);
          break;
        case this.topics.orderStatusHistory:
          await this.handleStatusHistoryEvent(op, after, before);
          break;
        default:
          this.logger.warn(`Unknown topic: ${topic}`);
      }
    } catch (error) {
      this.logger.error('Error processing message:', error);
    }
  }

  private async handleOrderEvent(op: string, after: any, before: any) {
    try {
      if (op === 'c' || op === 'u') {
        // Create or Update order
        const orderData = {
          order_id: after.order_id,
          customer_name: after.customer_name,
          order_date: new Date(after.order_date),
          total: parseFloat(after.total || '0'),
        };

        this.logger.log(
          `Processing ${op === 'c' ? 'create' : 'update'} for order ${orderData.order_id}`,
        );

        const order = await this.ordersService.upsertOrderBase(orderData);
        if (order) {
          this.ordersGateway.broadcastOrderUpdate(order);
          this.logger.log(`Order ${order.order_id} synchronized`);
        }
      } else if (op === 'd') {
        // Delete order
        this.logger.log(`Deleting order ${before.order_id}`);
        await this.ordersService.deleteOrder(before.order_id);
      }
    } catch (error) {
      this.logger.error('Error handling order event:', error);
    }
  }

  private async handleOrderItemEvent(op: string, after: any, before: any) {
    try {
      if (op === 'c' || op === 'u') {
        // Add or Update order item
        const itemData = {
          item_id: after.item_id,
          order_id: after.order_id,
          product_name: after.product_name,
          quantity: after.quantity,
          price: parseFloat(after.price || '0'),
        };

        this.logger.log(
          `Processing item ${itemData.item_id} for order ${itemData.order_id}`,
        );

        const order = await this.ordersService.upsertOrderItem(itemData);
        if (order) {
          this.ordersGateway.broadcastOrderUpdate(order);
          this.logger.log(`Order ${order.order_id} item updated`);
        }
      } else if (op === 'd') {
        this.logger.log(
          `Removing item ${before.item_id} from order ${before.order_id}`,
        );
        await this.ordersService.removeOrderItem(
          before.order_id,
          before.item_id,
        );
      }
    } catch (error) {
      this.logger.error('Error handling order item event:', error);
    }
  }

  private async handleStatusHistoryEvent(op: string, after: any, before: any) {
    try {
      if (op === 'c' || op === 'u') {
        const orderId = after.order_id;
        const statusId = after.status_id;
        const changedAt = new Date(after.changed_at);
        const notes = after.notes;

        this.logger.log(`Processing status change for order ${orderId}`);

        const updatedOrder = await this.ordersService.updateOrderStatus(
          orderId,
          statusId,
          changedAt,
          notes,
        );

        if (updatedOrder) {
          this.ordersGateway.broadcastOrderUpdate(updatedOrder);
          this.logger.log(`Order ${orderId} status updated and broadcasted`);
        }
      } else if (op === 'd') {
        this.logger.log('Delete operation on status history:', before);
      }
    } catch (error) {
      this.logger.error('Error handling status history event:', error);
    }
  }
}
