import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { OrdersModule } from '../orders/orders.module';
import { OrdersGateway } from '../websocket/orders.gateway';

@Module({
  imports: [OrdersModule],
  providers: [KafkaService, OrdersGateway],
  exports: [KafkaService],
})
export class KafkaModule {}
