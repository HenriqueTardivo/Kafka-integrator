.PHONY: help install dev dev-backend dev-frontend build build-backend build-frontend clean test

help:
	@echo ''
	@echo 'Opções:'
	@echo 'make install - Install dependencies for frontend and backend'
	@echo 'make dev - Start both frontend and backend in development mode'
	@echo 'make clean - Remove node_modules and build artifacts'
	@echo 'make dev-backend - Start only backend in development mode'
	@echo 'make dev-frontend - Start only frontend in development mode'
	@echo ''



# Install dependencies
install:
	@echo "Installing backend dependencies..."
	@cd backend/api && yarn install
	@echo "Installing frontend dependencies..."
	@cd frontend/web && bun install
	@echo "✓ Dependencies installed successfully"
	@echo "✓ Criando containers Docker..."
	@docker compose up 
	@make db-reset

# Database commands
db-migrate:
	@echo "Running database migrations..."
	@docker exec -i postgres psql -U postgres -d erp < database/ERP/migrate.sql
	@echo "✓ Migrations completed"

db-seed:
	@echo "Seeding database..."
	@docker exec -i postgres psql -U postgres -d erp < database/ERP/seed.sql
	@echo "✓ Database seeded successfully"

db-reset:
	@echo "Resetting database..."
	@make db-migrate
	@make db-seed
	@echo "✓ Database reset completed"

# Development mode
dev:
	@echo "Starting development servers..."
	@make -j2 dev-backend dev-frontend

dev-backend:
	@echo "Starting backend..."
	@cd backend/api && yarn start:dev

dev-frontend:
	@echo "Starting frontend..."
	@cd frontend/web && bun run dev
	
# Clean
clean:
	@echo "Cleaning build artifacts and dependencies..."
	@rm -rf backend/api/node_modules backend/api/dist
	@rm -rf frontend/web/node_modules frontend/web/dist
	@echo "✓ Clean completed"