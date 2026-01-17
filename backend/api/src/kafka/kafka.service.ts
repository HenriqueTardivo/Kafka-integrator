import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { OrdersTopicService } from './topics/orders-topic.service';
import { ItemsTopicService } from './topics/items-topic.service';
import { StatusTopicService } from './topics/status-topic.service';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private consumer: Consumer;

  private readonly topics = {
    orders: 'erp.public.orders',
    orderItems: 'erp.public.order_items',
    orderStatusHistory: 'erp.public.order_status_history',
  };

  constructor(
    private readonly ordersTopicService: OrdersTopicService,
    private readonly itemsTopicService: ItemsTopicService,
    private readonly statusTopicService: StatusTopicService,
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
      const key = message.key?.toString();

      this.logger.log(
        `Received message from topic ${topic}, partition ${partition}`,
      );

      if (!value || value === '') {
        if (key) {
          const keyData = JSON.parse(key);
          this.logger.log(`Delete operation detected for ID ${keyData.id}`);

          switch (topic) {
            case this.topics.orders:
              await this.ordersTopicService.handleDelete(keyData.id);
              break;
            case this.topics.orderItems:
              await this.itemsTopicService.handleDelete(
                keyData.id,
                keyData.order_id,
              );
              break;
            case this.topics.orderStatusHistory:
              await this.statusTopicService.handleDelete(keyData.id);
              break;
          }
        }
        return;
      }

      const parsedMessage = JSON.parse(value);
      this.logger.log(`Raw message: ${JSON.stringify(parsedMessage)}`);

      switch (topic) {
        case this.topics.orders:
          await this.ordersTopicService.handleCreateOrUpdate(parsedMessage);
          break;
        case this.topics.orderItems:
          await this.itemsTopicService.handleCreateOrUpdate(parsedMessage);
          break;
        case this.topics.orderStatusHistory:
          await this.statusTopicService.handleCreateOrUpdate(parsedMessage);
          break;
        default:
          this.logger.warn(`Unknown topic: ${topic}`);
      }
    } catch (error) {
      this.logger.error('Error processing message:', error);
      this.logger.error('Stack:', error.stack);
    }
  }
}
