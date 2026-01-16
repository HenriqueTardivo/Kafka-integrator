import { io, Socket } from "socket.io-client";
import { Order } from "./api";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:3000";

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(WS_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    this.socket.on("orderCreated", (order: Order) => {
      this.emit("orderCreated", order);
    });

    this.socket.on("orderUpdated", (order: Order) => {
      this.emit("orderUpdated", order);
    });

    this.socket.on("orderDeleted", (data: { orderId: number }) => {
      this.emit("orderDeleted", data);
    });

    this.socket.on("error", (error: any) => {
      console.error("WebSocket error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  getOrders() {
    if (this.socket) {
      this.socket.emit("getOrders");
    }
  }
}

export const websocketService = new WebSocketService();
