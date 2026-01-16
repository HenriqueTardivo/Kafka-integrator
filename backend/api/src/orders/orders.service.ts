import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  private readonly statusMap = {
    1: { code: 'pending', name: 'Pendente' },
    2: { code: 'processing', name: 'Processando' },
    3: { code: 'completed', name: 'Concluído' },
    4: { code: 'cancelled', name: 'Cancelado' },
  };

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(orderId: number): Promise<Order | null> {
    return this.orderModel.findOne({ order_id: orderId }).exec();
  }

  async create(orderData: Partial<Order>): Promise<Order> {
    const createdOrder = new this.orderModel(orderData);
    return createdOrder.save();
  }

  async updateOrderStatus(
    orderId: number,
    statusId: number,
    changedAt: Date,
    notes?: string,
  ): Promise<Order | null> {
    try {
      const status = this.statusMap[statusId];

      if (!status) {
        this.logger.warn(`Unknown status_id: ${statusId}`);
        return null;
      }

      const statusHistory = {
        status_code: status.code,
        status_name: status.name,
        changed_at: changedAt,
        notes: notes || '',
      };

      const order = await this.orderModel.findOne({ order_id: orderId });
      if (!order) {
        this.logger.warn(
          `Order ${orderId} not found. Cannot update status. Order should be created via orders topic first.`,
        );
        return null;
      }

      order.status_history.push(statusHistory);
      order.current_status = status.code;
      order.current_status_name = status.name;
      return order.save();
    } catch (error) {
      this.logger.error(`Error updating order ${orderId}:`, error);
      return null;
    }
  }

  async upsertOrder(orderData: Partial<Order>): Promise<Order> {
    const { order_id } = orderData;

    return this.orderModel
      .findOneAndUpdate(
        { order_id },
        { $set: orderData },
        { new: true, upsert: true },
      )
      .exec();
  }

  async deleteOrder(orderId: number): Promise<void> {
    await this.orderModel.deleteOne({ order_id: orderId }).exec();
  }

  async upsertOrderBase(orderData: {
    order_id: number;
    customer_name: string;
    order_date: Date;
    total: number;
  }): Promise<Order> {
    const { order_id, customer_name, order_date, total } = orderData;

    let order = await this.orderModel.findOne({ order_id });

    if (!order) {
      order = new this.orderModel({
        order_id,
        customer_name,
        order_date,
        total,
        items: [],
        status_history: [],
        current_status: 'pending',
        current_status_name: 'Pendente',
      });
      this.logger.log(`Creating new order ${order_id}`);
    } else {
      order.customer_name = customer_name;
      order.order_date = order_date;
      order.total = total;
      this.logger.log(`Updating order ${order_id}`);
    }

    return order.save();
  }

  async upsertOrderItem(itemData: {
    item_id: number;
    order_id: number;
    product_name: string;
    quantity: number;
    price: number;
  }): Promise<Order | null> {
    try {
      const { item_id, order_id, product_name, quantity, price } = itemData;

      const order = await this.orderModel.findOne({ order_id });
      if (!order) {
        this.logger.warn(
          `Order ${order_id} not found. Cannot add item. Order should be created first.`,
        );
        return null;
      }

      const existingItemIndex = order.items.findIndex(
        (item) => item.item_id === item_id,
      );

      const itemObject = {
        item_id,
        product_name,
        quantity,
        price,
      };

      if (existingItemIndex >= 0) {
        order.items[existingItemIndex] = itemObject;
        this.logger.log(`Updated item ${item_id} in order ${order_id}`);
      } else {
        order.items.push(itemObject);
        this.logger.log(`Added item ${item_id} to order ${order_id}`);
      }

      return order.save();
    } catch (error) {
      this.logger.error('Error upserting order item:', error);
      return null;
    }
  }

  async removeOrderItem(
    orderId: number,
    itemId: number,
  ): Promise<Order | null> {
    try {
      const order = await this.orderModel.findOne({ order_id: orderId });
      if (!order) {
        this.logger.warn(`Order ${orderId} not found.`);
        return null;
      }

      order.items = order.items.filter((item) => item.item_id !== itemId);
      this.logger.log(`Removed item ${itemId} from order ${orderId}`);

      return order.save();
    } catch (error) {
      this.logger.error('Error removing order item:', error);
      return null;
    }
  }
}
