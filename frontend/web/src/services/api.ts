const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Order {
  _id: string;
  order_id: number;
  customer_name: string;
  order_date: string;
  total: number;
  items: OrderItem[];
  status_history: StatusHistory[];
  current_status: string;
  current_status_name: string;
}

export interface OrderItem {
  item_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface StatusHistory {
  status_code: string;
  status_name: string;
  changed_at: string;
  notes: string;
}

export const api = {
  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return response.json();
  },

  async getOrder(id: number): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }
    return response.json();
  },
};
