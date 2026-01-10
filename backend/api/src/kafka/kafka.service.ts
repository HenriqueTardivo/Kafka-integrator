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

  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersGateway: OrdersGateway,
  ) {
    this.kafka = new Kafka({
      clientId: 'nestjs-consumer',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.consumer = this.kafka.consumer({
      groupId: 'order-status-consumer-group',
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

      // Subscribe to order status history topic
      await this.consumer.subscribe({
        topic: process.env.KAFKA_TOPIC || 'erp.public.order_status_history',
        fromBeginning: false,
      });

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });

      this.logger.log('Kafka consumer started');
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

      // Debezium sends events with before/after payloads
      const { op, after, before } = debeziumEvent.payload || debeziumEvent;

      // Handle different operation types
      if (op === 'c' || op === 'u') {
        // Create or Update operation
        await this.handleStatusChange(after);
      } else if (op === 'd') {
        // Delete operation
        this.logger.log('Delete operation detected:', before);
      }
    } catch (error) {
      this.logger.error('Error processing message:', error);
    }
  }

  private async handleStatusChange(statusData: any) {
    try {
      const orderId = statusData.order_id;
      const statusId = statusData.status_id;
      const changedAt = new Date(statusData.changed_at);
      const notes = statusData.notes;

      this.logger.log(`Processing status change for order ${orderId}`);

      // Update order in MongoDB
      const updatedOrder = await this.ordersService.updateOrderStatus(
        orderId,
        statusId,
        changedAt,
        notes,
      );

      if (updatedOrder) {
        // Notify WebSocket clients
        this.ordersGateway.broadcastOrderUpdate(updatedOrder);
        this.logger.log(`Order ${orderId} updated and broadcasted`);
      }
    } catch (error) {
      this.logger.error('Error handling status change:', error);
    }
  }
}
