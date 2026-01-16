# Frontend - Web Application

Este é o frontend da aplicação de integração Kafka-Debezium-DB.

## Tecnologias

- React 18
- TypeScript
- Vite
- React Router DOM
- Socket.IO Client

## Funcionalidades

- 📋 **Listagem de Pedidos**: Visualize todos os pedidos em tempo real
- 🔍 **Detalhes do Pedido**: Veja informações completas de cada pedido
- 🔄 **Atualizações em Tempo Real**: Receba atualizações instantâneas via WebSocket
- 📊 **Histórico de Status**: Acompanhe todas as mudanças de status dos pedidos

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto (ou renomeie `.env.example`):

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o linter

## Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
├── hooks/            # Custom hooks (useOrders, useOrder)
├── pages/            # Páginas da aplicação
├── services/         # Serviços (API e WebSocket)
├── types/            # Definições de tipos TypeScript
└── App.tsx           # Componente principal
```

## Integração com Backend

O frontend se conecta ao backend NestJS através de:

### REST API

- `GET /orders` - Lista todos os pedidos
- `GET /orders/:id` - Obtém detalhes de um pedido específico

### WebSocket

Eventos recebidos:

- `orderCreated` - Novo pedido criado
- `orderUpdated` - Pedido atualizado
- `orderDeleted` - Pedido removido

## Status dos Pedidos

- 🟡 **Pendente** - Pedido criado, aguardando processamento
- 🔵 **Processando** - Pedido em processamento
- 🟢 **Concluído** - Pedido finalizado com sucesso
- 🔴 **Cancelado** - Pedido cancelado

## Desenvolvimento

### Hooks Personalizados

#### `useOrders()`

Hook para gerenciar a lista de pedidos com atualizações em tempo real.

```typescript
const { orders, loading, error, reload } = useOrders();
```

#### `useOrder(orderId)`

Hook para gerenciar um pedido específico com atualizações em tempo real.

```typescript
const { order, loading, error, reload } = useOrder(orderId);
```

### Serviços

#### API Service

Gerencia chamadas HTTP para o backend REST API.

#### WebSocket Service

Gerencia a conexão WebSocket e eventos em tempo real.

## Build para Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.
