import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  // Mapeamento de status_id para status_code
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

      // Buscar ou criar o pedido
      let order = await this.orderModel.findOne({ order_id: orderId });

      if (!order) {
        this.logger.log(`Order ${orderId} not found, creating new order`);

        // Se o pedido não existe, buscar dados do ERP (simulado por enquanto)
        // Em produção, você precisaria ter um mecanismo para buscar dados completos
        order = new this.orderModel({
          order_id: orderId,
          customer_name: 'Cliente Desconhecido',
          order_date: new Date(),
          total: 0,
          items: [],
          status_history: [statusHistory],
          current_status: status.code,
          current_status_name: status.name,
        });

        return order.save();
      }

      // Atualizar pedido existente
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
}
