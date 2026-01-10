import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import { KafkaModule } from './kafka/kafka.module';
import { OrdersGateway } from './websocket/orders.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/orders',
    ),
    OrdersModule,
    KafkaModule,
  ],
  providers: [OrdersGateway],
})
export class AppModule {}
