import { useNavigate } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";

const statusColors = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  completed: "#10b981",
  returned: "#ef4444",
};

export function OrderList() {
  const navigate = useNavigate();
  const { orders, loading, error } = useOrders();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ fontSize: "18px", color: "#6b7280" }}>
          Carregando pedidos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ fontSize: "18px", color: "#ef4444" }}>{error}</p>
      </div>
    );
  }

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
        Pedidos ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "18px", color: "#6b7280" }}>
            Nenhum pedido encontrado
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
        >
          {orders.map((order) => (
            <div
              key={order.order_id}
              onClick={() => navigate(`/orders/${order.order_id}`)}
              style={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    margin: "0 0 4px 0",
                  }}
                >
                  Pedido #{order.order_id}
                </h3>
                <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
                  {order.customer_name}
                </p>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: "0 0 4px 0",
                  }}
                >
                  {new Date(order.order_date).toLocaleDateString("pt-BR")}
                </p>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  R$ {order.total.toFixed(2)}
                </p>
              </div>

              <span
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor:
                    statusColors[
                      order.current_status as keyof typeof statusColors
                    ] + "20",
                  color:
                    statusColors[
                      order.current_status as keyof typeof statusColors
                    ],
                }}
              >
                {order.current_status_name}
              </span>

              {order.items.length > 0 && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    margin: "12px 0 0 0",
                  }}
                >
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "itens"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
