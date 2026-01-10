import { useNavigate } from "react-router-dom";
import { mockOrders } from "../data/mockOrders";
import { OrderCard } from "../components/OrderCard";

export function OrderList() {
  const navigate = useNavigate();

  return (
    <div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "24px",
          color: "#111827",
        }}
      >
        Pedidos
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {mockOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onClick={() => navigate(`/orders/${order.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
