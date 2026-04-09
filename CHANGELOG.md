# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Clean Architecture project scaffold (Entity, Repository, Service, Controller)
- Task CRUD API with Zod validation and Swagger docs
- Project CRUD API with pagination support
- JWT authentication (register, login) with bcrypt password hashing
- Role-based authorization middleware (user, admin)
- Rate limiting (general API + stricter auth endpoints)
- Request ID correlation for log tracing
- Async error handler wrapper for Express routes
- Structured error classes (AppError, NotFoundError, ValidationError, etc.)
- Reusable validation middleware (Zod schema-based)
- Health check (`/health`) and readiness probe (`/ready`) endpoints
- Prometheus metrics endpoint (`/metrics`)
- Request duration and count metrics
- In-memory cache with TTL (Redis-swappable interface)
- Response compression (gzip)
- Pagination utility with typed response format
- Soft delete support (BaseEntity.deletedAt)
- Task ↔ Project relationship (ManyToOne)
- Transaction utility wrapper
- Database seed data (users, projects, tasks)
- Database connection pool configuration
- Performance indexes (task status, project_id, priority, user email)
- Docker multi-stage build with non-root user and health check
- Docker Compose for development and staging
- GitHub Actions CI pipeline (lint, format, test, build, Docker)
- GitHub Actions deploy pipeline (GHCR push, staging/production)
- Database backup and restore scripts
- ESLint + Prettier + EditorConfig code standards
- PR template, issue templates (bug report, feature request)
- API versioning via route aggregation (`/api/v1/`)
- Graceful shutdown with SIGTERM/SIGINT handling
- 5-phase project roadmap (`docs/ROADMAP.md`)
