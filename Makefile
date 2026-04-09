.PHONY: help dev build start test lint format docker-up docker-down db-migrate db-seed db-backup db-restore clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development server with hot reload
	npm run dev

build: ## Compile TypeScript
	npm run build

start: build ## Build and start production server
	npm start

test: ## Run tests
	npm test

test-coverage: ## Run tests with coverage
	npm run test:coverage

lint: ## Run linter
	npm run lint

lint-fix: ## Fix lint issues
	npm run lint:fix

format: ## Format code
	npm run format

format-check: ## Check code formatting
	npm run format:check

docker-up: ## Start all services with Docker Compose
	docker compose up -d --build

docker-down: ## Stop all services
	docker compose down

docker-logs: ## Tail service logs
	docker compose logs -f

docker-staging: ## Start staging environment
	docker compose -f docker-compose.staging.yml up -d --build

db-migrate: ## Run database migrations
	npm run migration:run

db-migrate-revert: ## Revert last migration
	npm run migration:revert

db-seed: ## Seed database with sample data
	npx ts-node src/seeds/index.ts

db-backup: ## Backup database
	./scripts/db-backup.sh

db-restore: ## Restore database from backup
	@echo "Usage: ./scripts/db-restore.sh <backup_file.sql.gz>"

clean: ## Remove build artifacts
	rm -rf dist coverage
