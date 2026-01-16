# Integração Frontend com Backend

## ✅ Integração Completa Implementada

A integração entre o frontend React e o backend NestJS foi implementada com sucesso, incluindo comunicação REST API e WebSocket para atualizações em tempo real.

## 📁 Arquivos Criados

### Serviços

1. **`src/services/api.ts`**

   - Serviço para comunicação com a REST API
   - Endpoints: `getOrders()`, `getOrder(id)`
   - Tipagem completa com interfaces TypeScript

2. **`src/services/websocket.ts`**
   - Gerenciamento de conexão WebSocket usando Socket.IO
   - Eventos: `orderCreated`, `orderUpdated`, `orderDeleted`
   - Reconexão automática e gerenciamento de listeners

### Hooks Personalizados

3. **`src/hooks/useOrders.ts`**

   - Hook para gerenciar lista de pedidos
   - Integra API REST + WebSocket
   - Retorna: `{ orders, loading, error, reload }`

4. **`src/hooks/useOrder.ts`**
   - Hook para gerenciar pedido individual
   - Atualização em tempo real via WebSocket
   - Retorna: `{ order, loading, error, reload }`

### Configuração

5. **`.env`**

   - Variáveis de ambiente para URLs do backend
   - `VITE_API_URL` e `VITE_WS_URL`

6. **`.env.example`**

   - Template para configuração

7. **`README.md`**
   - Documentação completa do frontend

## 📝 Arquivos Atualizados

### Páginas

1. **`src/pages/OrderList.tsx`**

   - ❌ Removido: uso de dados mockados
   - ✅ Adicionado: hook `useOrders()` para dados reais
   - ✅ Adicionado: estados de loading e error
   - ✅ Adicionado: contador de pedidos
   - ✅ Atualizado: mapeamento de propriedades para match com backend
     - `order.id` → `order.order_id`
     - `order.customerName` → `order.customer_name`
     - `order.date` → `order.order_date`
     - `order.status` → `order.current_status`

2. **`src/pages/OrderDetail.tsx`**

   - ❌ Removido: uso de dados mockados
   - ✅ Adicionado: hook `useOrder(id)` para dados reais
   - ✅ Adicionado: estados de loading e error
   - ✅ Adicionado: histórico de status do pedido
   - ✅ Atualizado: mapeamento de propriedades
     - `item.id` → `item.item_id`
     - `item.name` → `item.product_name`

3. **`package.json`**
   - ✅ Adicionado: `socket.io-client` como dependência

## 🔄 Fluxo de Dados

### Carregamento Inicial

```
1. Componente monta
2. Hook conecta ao WebSocket
3. Hook busca dados via REST API
4. Dados são exibidos na UI
```

### Atualizações em Tempo Real

```
1. Backend emite evento WebSocket
2. WebSocket Service recebe evento
3. Hook atualiza estado local
4. UI re-renderiza automaticamente
```

## 🎯 Funcionalidades Implementadas

### Lista de Pedidos

- ✅ Carregamento inicial via API
- ✅ Atualizações em tempo real (novos pedidos)
- ✅ Atualização de status em tempo real
- ✅ Remoção de pedidos em tempo real
- ✅ Loading state
- ✅ Error handling
- ✅ Contador de pedidos
- ✅ Grid responsivo

### Detalhes do Pedido

- ✅ Carregamento via API por ID
- ✅ Atualizações em tempo real
- ✅ Exibição de itens do pedido
- ✅ Cálculo de subtotais
- ✅ Histórico de status com timeline
- ✅ Loading state
- ✅ Error handling
- ✅ Tratamento de pedido não encontrado

## 🔌 Endpoints Integrados

### REST API (GET)

- `GET http://localhost:3000/orders` - Lista todos os pedidos
- `GET http://localhost:3000/orders/:id` - Detalhes de um pedido

### WebSocket (Socket.IO)

- **Conexão**: `http://localhost:3000`
- **Eventos recebidos**:
  - `orderCreated` - Novo pedido criado
  - `orderUpdated` - Pedido atualizado
  - `orderDeleted` - Pedido removido
  - `error` - Erros do servidor

## 📦 Dependências Adicionadas

```json
{
  "socket.io-client": "^4.8.1"
}
```

## 🚀 Como Usar

### 1. Instalar dependências

```bash
cd frontend/web
npm install
```

### 2. Configurar variáveis de ambiente

```bash
# Criar .env (já criado)
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

### 3. Iniciar o frontend

```bash
npm run dev
```

### 4. Iniciar o backend

```bash
cd backend/api
npm run start:dev
```

### 5. Testar a integração

1. Acesse `http://localhost:5173`
2. Verifique se os pedidos são carregados
3. No backend, crie/atualize pedidos via Kafka
4. Observe as atualizações em tempo real no frontend

## 🎨 Mapeamento de Dados

### Backend → Frontend

| Backend                | Frontend (UI)         |
| ---------------------- | --------------------- |
| `order_id`             | ID do Pedido          |
| `customer_name`        | Nome do Cliente       |
| `order_date`           | Data do Pedido        |
| `total`                | Valor Total           |
| `current_status`       | Status Atual (código) |
| `current_status_name`  | Status Atual (nome)   |
| `items[].item_id`      | ID do Item            |
| `items[].product_name` | Nome do Produto       |
| `items[].quantity`     | Quantidade            |
| `items[].price`        | Preço                 |
| `status_history[]`     | Histórico de Status   |

## 🔐 CORS

O backend já está configurado com CORS para aceitar conexões do frontend:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
});
```

WebSocket também configurado:

```typescript
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
```

## ✨ Próximos Passos Sugeridos

1. **Filtros e Busca**: Adicionar filtros por status, cliente, data
2. **Paginação**: Implementar paginação para grandes volumes de dados
3. **Notificações**: Toast notifications para novos pedidos
4. **Testes**: Adicionar testes unitários e de integração
5. **Performance**: Implementar virtualização para listas longas
6. **PWA**: Converter para Progressive Web App
7. **Autenticação**: Adicionar autenticação de usuários

## 🐛 Troubleshooting

### WebSocket não conecta

- Verifique se o backend está rodando
- Confirme as URLs no `.env`
- Verifique o console do navegador para erros

### Dados não carregam

- Verifique se há pedidos no MongoDB
- Confirme que a API REST está respondendo
- Verifique CORS no backend

### Atualizações em tempo real não funcionam

- Verifique conexão WebSocket no console
- Confirme que os eventos estão sendo emitidos no backend
- Verifique se os listeners estão registrados corretamente

## 📚 Documentação Adicional

- [React Hooks](https://react.dev/reference/react)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
