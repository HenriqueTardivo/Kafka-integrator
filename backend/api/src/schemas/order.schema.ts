import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  item_id: number;

  @Prop({ required: true })
  product_name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit_price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class StatusHistory {
  @Prop({ required: true })
  status_code: string;

  @Prop({ required: true })
  status_name: string;

  @Prop({ required: true })
  changed_at: Date;

  @Prop()
  notes?: string;
}

export const StatusHistorySchema = SchemaFactory.createForClass(StatusHistory);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  order_id: number;

  @Prop({ required: true })
  customer_name: string;

  @Prop({ required: true })
  order_date: Date;

  @Prop({ required: true })
  total: number;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ type: [StatusHistorySchema], default: [] })
  status_history: StatusHistory[];

  @Prop()
  current_status?: string;

  @Prop()
  current_status_name?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ order_id: 1 });
OrderSchema.index({ current_status: 1 });
OrderSchema.index({ customer_name: 1 });
