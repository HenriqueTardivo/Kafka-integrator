import { Order } from "../types/Order";

export const mockOrders: Order[] = [
  {
    id: "1",
    customerName: "João Silva",
    date: "2026-01-10",
    status: "completed",
    total: 299.99,
    items: [
      { id: "1", name: "Notebook Lenovo", quantity: 1, price: 249.99 },
      { id: "2", name: "Mouse Logitech", quantity: 2, price: 25.0 },
    ],
  },
  {
    id: "2",
    customerName: "Maria Santos",
    date: "2026-01-09",
    status: "processing",
    total: 159.9,
    items: [{ id: "3", name: "Teclado Mecânico", quantity: 1, price: 159.9 }],
  },
  {
    id: "3",
    customerName: "Pedro Oliveira",
    date: "2026-01-08",
    status: "pending",
    total: 549.99,
    items: [
      { id: "4", name: 'Monitor LG 27"', quantity: 1, price: 499.99 },
      { id: "5", name: "Cabo HDMI", quantity: 1, price: 50.0 },
    ],
  },
  {
    id: "4",
    customerName: "Ana Costa",
    date: "2026-01-07",
    status: "completed",
    total: 89.9,
    items: [{ id: "6", name: "Webcam HD", quantity: 1, price: 89.9 }],
  },
  {
    id: "5",
    customerName: "Carlos Mendes",
    date: "2026-01-06",
    status: "cancelled",
    total: 1299.0,
    items: [{ id: "7", name: "Notebook Dell", quantity: 1, price: 1299.0 }],
  },
];
