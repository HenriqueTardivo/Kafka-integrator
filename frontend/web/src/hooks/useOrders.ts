import { useState, useEffect } from "react";
import { api, Order } from "../services/api";
import { websocketService } from "../services/websocket";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    websocketService.connect();
    loadOrders();

    const handleOrderCreated = (order: Order) => {
      setOrders((prev) => {
        if (prev.some((o) => o.order_id === order.order_id)) {
          return prev;
        }
        return [...prev, order];
      });
    };

    const handleOrderUpdated = (order: Order) => {
      setOrders((prev) => {
        const existingIndex = prev.findIndex(
          (o) => o.order_id === order.order_id,
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = order;
          return updated;
        } else {
          return [...prev, order];
        }
      });
    };

    const handleOrderDeleted = (data: { orderId: number }) => {
      setOrders((prev) => prev.filter((o) => o.order_id !== data.orderId));
    };

    websocketService.on("orderCreated", handleOrderCreated);
    websocketService.on("orderUpdated", handleOrderUpdated);
    websocketService.on("orderDeleted", handleOrderDeleted);

    return () => {
      websocketService.off("orderCreated", handleOrderCreated);
      websocketService.off("orderUpdated", handleOrderUpdated);
      websocketService.off("orderDeleted", handleOrderDeleted);
    };
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar pedidos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, error, reload: loadOrders };
}
