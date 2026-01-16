import { useState, useEffect } from "react";
import { api, Order } from "../services/api";
import { websocketService } from "../services/websocket";

export function useOrder(orderId: number) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    websocketService.connect();

    loadOrder();

    const handleOrderUpdated = (updatedOrder: Order) => {
      if (updatedOrder.order_id === orderId) {
        setOrder(updatedOrder);
      }
    };

    const handleOrderDeleted = (data: { orderId: number }) => {
      if (data.orderId === orderId) {
        setOrder(null);
      }
    };

    websocketService.on("orderUpdated", handleOrderUpdated);
    websocketService.on("orderDeleted", handleOrderDeleted);

    return () => {
      websocketService.off("orderUpdated", handleOrderUpdated);
      websocketService.off("orderDeleted", handleOrderDeleted);
    };
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await api.getOrder(orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar pedido");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { order, loading, error, reload: loadOrder };
}
