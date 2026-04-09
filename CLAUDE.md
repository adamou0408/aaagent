# CLAUDE.md — Project Conventions for AI Assistants

## Project Overview

TypeScript + Express API with Clean Architecture, PostgreSQL persistence, JWT auth, and Docker deployment.

## Commands

- `make dev` — Start development server
- `make build` — Compile TypeScript
- `make test` — Run tests
- `make test-coverage` — Run tests with coverage report
- `make lint` — Run ESLint
- `make format` — Format with Prettier
- `make docker-up` — Start all services (app + PostgreSQL)
- `make docker-staging` — Start staging environment
- `make db-migrate` — Run database migrations
- `make db-seed` — Seed database with sample data
- `make db-backup` — Backup database
- `make clean` — Remove build artifacts

## Architecture

```
src/
├── config/         # Environment, logger, database, swagger, cache, metrics
├── entities/       # TypeORM entities (DB models) — all extend BaseEntity
├── repositories/   # Data access layer — TypeORM queries
├── services/       # Business logic — orchestrates repositories
├── controllers/    # HTTP handlers + route definitions + Zod validation
├── middlewares/     # Express middleware (auth, rate-limit, validation, metrics, errors)
├── migrations/     # TypeORM migrations (never use synchronize: true)
├── routes/         # API version aggregators (v1.ts, v2.ts)
├── seeds/          # Development/test seed data
└── utils/          # Shared utilities (pagination, errors, async-handler, transactions)
```

**Dependency rule**: Controller → Service → Repository → Entity. Never skip layers.

## Key Patterns

- All entities extend `BaseEntity` (id, createdAt, updatedAt, deletedAt)
- Soft delete by default (BaseEntity.deletedAt)
- Use `validate(zodSchema)` middleware for request validation
- Use `asyncHandler()` to wrap async route handlers
- Use `authenticate` middleware for protected routes
- Use `authorize(UserRole.ADMIN)` for role-based access
- Structured errors: throw `new AppError(msg, statusCode)` or subclasses
- Paginated lists: return `{ data: T[], meta: { page, limit, total, totalPages } }`
- Single items: return `{ data: T }`
- Errors: return `{ error: { code, message } }`

## Conventions

- Environment variables validated via Zod in `src/config/env.ts`
- Database schema changes require a migration — never use `synchronize: true`
- Use structured logging via `logger` from `src/config/logger.ts`
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Constructor injection for testability (services accept optional repo params)

## Testing

- Unit tests: `tests/unit/` — test services with mocked repositories
- Integration tests: `tests/integration/` — test API endpoints with supertest
- Run: `npm test` or `make test`
- Coverage: `npm run test:coverage` (60% minimum enforced)

## API Endpoints

- `GET /health` — Liveness probe
- `GET /ready` — Readiness probe (checks DB)
- `GET /metrics` — Prometheus metrics
- `GET /docs` — Swagger UI
- `POST /api/v1/auth/register` — Register
- `POST /api/v1/auth/login` — Login (returns JWT)
- `GET/POST/PATCH/DELETE /api/v1/tasks` — Task CRUD (paginated)
- `GET/POST/PATCH/DELETE /api/v1/projects` — Project CRUD (paginated)
