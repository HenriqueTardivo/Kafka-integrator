import { Order } from "../types/Order";

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

const statusColors = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef4444",
};

const statusLabels = {
  pending: "Pendente",
  processing: "Processando",
  completed: "Concluído",
  cancelled: "Cancelado",
};

export function OrderCard({ order, onClick }: OrderCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.2s",
        backgroundColor: "#ffffff",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Pedido #{order.id}
        </h3>
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
            backgroundColor: statusColors[order.status] + "20",
            color: statusColors[order.status],
          }}
        >
          {statusLabels[order.status]}
        </span>
      </div>
      <div style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px" }}>
        <p style={{ margin: "4px 0" }}>Cliente: {order.customerName}</p>
        <p style={{ margin: "4px 0" }}>
          Data: {new Date(order.date).toLocaleDateString("pt-BR")}
        </p>
      </div>
      <div style={{ fontSize: "20px", fontWeight: "700", color: "#111827" }}>
        R$ {order.total.toFixed(2)}
      </div>
    </div>
  );
}
