import { useParams, useNavigate } from "react-router-dom";
import { mockOrders } from "../data/mockOrders";

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

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = mockOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <h1>Pedido não encontrado</h1>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            marginTop: "16px",
          }}
        >
          Voltar para listagem
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "8px 16px",
          backgroundColor: "#6b7280",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          marginBottom: "24px",
        }}
      >
        ← Voltar
      </button>

      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: 0,
              color: "#111827",
            }}
          >
            Pedido #{order.id}
          </h1>
          <span
            style={{
              padding: "8px 16px",
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: "600",
              backgroundColor: statusColors[order.status] + "20",
              color: statusColors[order.status],
            }}
          >
            {statusLabels[order.status]}
          </span>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#111827",
            }}
          >
            Informações do Pedido
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              color: "#6b7280",
            }}
          >
            <div>
              <strong>Cliente:</strong> {order.customerName}
            </div>
            <div>
              <strong>Data:</strong>{" "}
              {new Date(order.date).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>

        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#111827",
            }}
          >
            Itens do Pedido
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    color: "#6b7280",
                    fontWeight: "600",
                  }}
                >
                  Produto
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    color: "#6b7280",
                    fontWeight: "600",
                  }}
                >
                  Quantidade
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "12px",
                    color: "#6b7280",
                    fontWeight: "600",
                  }}
                >
                  Preço Unitário
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "12px",
                    color: "#6b7280",
                    fontWeight: "600",
                  }}
                >
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "12px", color: "#111827" }}>
                    {item.name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: "#111827",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      color: "#111827",
                    }}
                  >
                    R$ {item.price.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      color: "#111827",
                      fontWeight: "600",
                    }}
                  >
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "2px solid #e5e7eb",
              textAlign: "right",
            }}
          >
            <span
              style={{ fontSize: "24px", fontWeight: "700", color: "#111827" }}
            >
              Total: R$ {order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
