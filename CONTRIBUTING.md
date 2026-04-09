# Contributing Guide

## Development Setup

```bash
# 1. Clone and install
git clone <repo-url> && cd aaagent
cp .env.example .env
npm install

# 2. Start database
docker compose up db -d

# 3. Run migrations
make db-migrate

# 4. Start dev server
make dev
```

## Development Workflow

1. Create a branch from `main`: `git checkout -b feature/your-feature`
2. Write code following the architecture guidelines (see CLAUDE.md)
3. Run checks before committing:
   ```bash
   make lint
   make format-check
   make test
   make build
   ```
4. Commit with conventional messages:
   - `feat: add user authentication`
   - `fix: resolve task status update race condition`
   - `docs: update API endpoint documentation`
   - `refactor: extract validation middleware`
5. Open a Pull Request using the PR template

## Architecture Rules

- **Entities** — Database models only, no business logic
- **Repositories** — Data access layer, raw queries and ORM calls
- **Services** — Business logic, orchestrates repositories
- **Controllers** — HTTP layer, request validation and response formatting
- **Middlewares** — Cross-cutting concerns (auth, logging, error handling)

Dependencies flow **inward**: Controller → Service → Repository → Entity.
Never skip layers (e.g., controller calling repository directly).

## Adding a New Feature

1. Define the entity in `src/entities/`
2. Create a migration in `src/migrations/`
3. Add repository in `src/repositories/`
4. Implement service in `src/services/`
5. Wire up controller in `src/controllers/`
6. Register route in `src/index.ts`
7. Add tests in `tests/`
