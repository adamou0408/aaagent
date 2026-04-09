# CLAUDE.md — Project Conventions for AI Assistants

## Project Overview

TypeScript + Express API with Clean Architecture, PostgreSQL persistence, and Docker deployment.

## Commands

- `make dev` — Start development server
- `make build` — Compile TypeScript
- `make test` — Run tests
- `make lint` — Run ESLint
- `make format` — Format with Prettier
- `make docker-up` — Start all services
- `make db-migrate` — Run database migrations

## Architecture

```
src/
├── config/         # Environment, logger, database, swagger config
├── entities/       # TypeORM entities (DB models)
├── repositories/   # Data access layer
├── services/       # Business logic
├── controllers/    # HTTP handlers + route definitions
├── middlewares/     # Express middleware (error handling, logging)
├── migrations/     # TypeORM migrations
└── utils/          # Shared utilities
```

**Dependency rule**: Controller → Service → Repository → Entity. Never skip layers.

## Conventions

- All entities extend `BaseEntity` (provides id, createdAt, updatedAt)
- Use Zod schemas for request validation in controllers
- Use structured logging via `logger` from `src/config/logger.ts`
- Database schema changes require a migration file — never use `synchronize: true`
- API responses follow `{ data: T }` for success, `{ error: string }` for errors
- Environment variables are validated via Zod in `src/config/env.ts`

## Testing

- Unit tests: `tests/unit/` — test services with mocked repositories
- Integration tests: `tests/integration/` — test API endpoints
- Run: `npm test`
