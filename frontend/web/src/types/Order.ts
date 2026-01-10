export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
