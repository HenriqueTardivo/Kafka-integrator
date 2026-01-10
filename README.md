# Integrador de sistemas com Kafka + Debezium

Este repositório demonstra uma integração CDC (Change Data Capture) usando Debezium
para monitorar um banco de dados PostgreSQL (ERP). As mudanças são publicadas em tópicos
Kafka; uma API externa (NestJS) consome os eventos, popula/atualiza um MongoDB e
transmite atualizações para um frontend React via WebSocket (Socket.IO).

Principais componentes

- `postgres` : Banco ERP (origem)
- `kafka` : Broker Kafka
- `kafka-connect` : Debezium / Kafka Connect
- `backend/api` : NestJS — consumidor Kafka, persistência em MongoDB e WebSocket
- `frontend/web` : React + Vite — interface cliente
- `mongodb` : Armazena cópia dos pedidos atualizada pela API

## Pré-requisitos

- Docker e Docker Compose
- Yarn (para backend)
- Bun (opcional, para frontend)

## Quick start

1. Subir containers e instalar dependências:

```bash
make install
```

2. Iniciar backend e frontend em modo desenvolvimento:

```bash
make dev
```

3. Para limpar volumes e reiniciar tudo (útil quando mudar configs de Kafka):

```bash
docker-compose down -v
docker-compose up -d
make db-reset
```

## Estrutura do repositório

- `backend/api` — código NestJS (consumer Kafka, MongoDB, WebSocket)
- `frontend/web` — UI React + Vite
- `database/ERP` — scripts SQL para schema e seed do ERP
- `docker-compose.yml` — serviços: Kafka, Zookeeper, Postgres, MongoDB, Debezium, Kafka UI

## Variáveis de ambiente

- Veja `backend/api/.env.example` para as variáveis usadas pelo backend

Versão em inglês disponível em `README.en.md`.
