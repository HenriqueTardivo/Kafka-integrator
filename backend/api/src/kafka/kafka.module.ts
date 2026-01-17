import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { OrdersModule } from '../orders/orders.module';
import { OrdersGateway } from '../websocket/orders.gateway';
import { OrdersTopicService } from './topics/orders-topic.service';
import { ItemsTopicService } from './topics/items-topic.service';
import { StatusTopicService } from './topics/status-topic.service';

@Module({
  imports: [OrdersModule],
  providers: [
    KafkaService,
    OrdersGateway,
    OrdersTopicService,
    ItemsTopicService,
    StatusTopicService,
  ],
  exports: [KafkaService],
})
export class KafkaModule {}
