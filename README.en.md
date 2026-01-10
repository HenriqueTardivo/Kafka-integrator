# Kafka + Debezium Integration Example

This repository is an example of Change Data Capture (CDC) using Debezium to monitor
a PostgreSQL ERP database. Changes are published to Kafka topics; a separate API
(NestJS) consumes those events, keeps a MongoDB copy of orders updated and pushes
real-time updates to a React frontend via WebSocket (Socket.IO).

Key components

- `postgres`: ERP source database
- `kafka`: Kafka broker
- `kafka-connect`: Debezium / Kafka Connect for CDC
- `backend/api`: NestJS — Kafka consumer, MongoDB persistence, WebSocket gateway
- `frontend/web`: React + Vite — client UI
- `mongodb`: Stores replicated orders

## Prerequisites

- Docker & Docker Compose
- Yarn (backend)
- Bun (optional, frontend)

## Quick start

1. Install dependencies and start containers:

```bash
make install
```

2. Start backend and frontend in development mode:

```bash
make dev
```

3. To reset containers and DB data:

```bash
docker-compose down -v
docker-compose up -d
make db-reset
```

## Repository layout

- `backend/api` — NestJS app (consumer, persistence, websocket)
- `frontend/web` — React + Vite
- `database/ERP` — SQL schema & seed scripts
- `docker-compose.yml` — Kafka, Zookeeper, Postgres, MongoDB, Debezium, Kafka UI

## Environment variables

- See `backend/api/.env.example` for backend configuration (MongoDB URI, Kafka broker, topic, frontend URL).

## Operational notes

- If Kafka logs "Replication factor larger than available brokers", recreate containers
  with `docker-compose down -v` and `docker-compose up -d` (the compose file sets
  replication factors to 1 for development).
- If Kafka UI doesn't start, inspect `kafka-ui` container logs and ensure `kafka-connect`
  is reachable as configured in `docker-compose.yml`.

## Useful files

- ERP schema/seed: [database/ERP/database.sql](database/ERP/database.sql)
- Makefile: [Makefile](Makefile)

---

If you want, I can also add examples for deploying to production, or a CONTRIBUTING.md.
