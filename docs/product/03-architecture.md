# Architecture Overview

## System Context
Car Neon City Racer  runs as a Docker Compose product with JavaScript / TypeScript talking to Node.js + Express, JWT over containerized local/dev deployment via Docker; Node.js backend service boundary.

# Project Protocol Intelligence

## Technology Direction
Frontend: JavaScript / TypeScript.
Backend: Node.js + Express, JWT.
Database: PostgreSQL.
Deployment runtime: Docker Compose with environment-specific manifests and deterministic port allocation.
Verification: npm test; lint/static checks: npm run lint.

## Naming Conventions
Use clear domain-first names for modules, routes, API resources, database tables, tickets, branches, and deployment environments.
Use kebab-case for routes and branches, PascalCase for UI components, snake_case for database columns, and stable ticket IDs in commit/release notes.
Name seed users, roles, permissions, env vars, Docker services, and health endpoints explicitly so reviewers can test without guessing.

## Architecture Standards
- Preserve a documented frontend/backend/database boundary.
- Frontend must follow JavaScript / TypeScript conventions and avoid legacy visual patterns.
- Backend must expose typed API contracts, layered business logic, validation, and health endpoints.
- Database design must include ownership, indexes, seed data, migrations, and rollback-safe changes.
- Deployment must be container-first with environment manifests for local, dev, UAT, staging, and production.

## Development Protocols
- Every milestone and ticket must inherit these standards.
- Agents must update docs, memory, graph context, tests, and release evidence when code changes.
- Use npm test and npm run lint as baseline verification unless a ticket explicitly changes the test policy. Persistent state lives in PostgreSQL and the local project root is `/home/ubuntu/2026/product-aidlc/projects/car-neon-city-racer`.

## Components
- Frontend: JavaScript / TypeScript
- API: Node.js + Express, JWT
- Data store: PostgreSQL
- Workers: background jobs are optional; keep core approval flow synchronous until explicit queue needs appear.

## Data Model
- Organization / workspace
- User / role membership
- Project
- Approval request
- Review / comment thread
- Uploaded document metadata
- Audit event

### Ownership Notes
Every project, approval, file reference, and audit event must retain tenant/workspace ownership.

## Integrations
- API contract: containerized local/dev deployment via Docker; Node.js backend service boundary.

## Seed Boundaries
- **Seed Users**: Deterministic accounts with credentials (`admin@car-neon-city-racer.local` / `ChangeMe!12345`, `reviewer@car-neon-city-racer.local` / `ChangeMe!12345`, `racer1@car-neon-city-racer.local`, `racer2@car-neon-city-racer.local`).
- **Seed Entities**: Workspace `ws-neon-prime`, tracks (`trk-001`, `trk-002`, `trk-003`), vehicles (`veh-001`, `veh-002`, `veh-003`), approval flows (`appr-001`, `appr-002`, `appr-003`), and audit events (`audit-001`, `audit-002`, `audit-003`).
- **Data Lifecycle**: `npm run seed` (`node src/seed/seed.js`) populates baseline data idempotently. `npm run reset` (`node src/seed/reset.js`) clears and reseeds local data, with production safety guards (`ALLOW_PROD_RESET=true` required in production).

## Auth Boundaries
- **Token Mechanism**: Standard JWT (JSON Web Token) using HMAC-SHA256 (`HS256`).
  - Standard Claims: `userId` (or `sub`), `email`, `role`, `workspaceId`, `iat` (issued at), `exp` (expiration), `iss` (`car-neon-city-racer`), `aud` (`car-neon-city-racer-api`).
  - Lifespan: Default 3600 seconds (1 hour) for access tokens; 604800 seconds (7 days) for refresh tokens.
  - Secret Handling: Managed via `JWT_SECRET` environment variable (minimum 32 characters; never committed to client bundle).
- **Password Security**: Salted PBKDF2-SHA256 with constant-time equality checks to prevent timing attacks.
- **RBAC Matrix**:
  - `admin`: Full system access (`workspace:manage`, `user:manage`, `approval:approve`, `audit:view`, `race:play`, etc.).
  - `reviewer`: Race marshal role (`approval:review`, `approval:approve`, `approval:reject`, `audit:view`, `score:view`).
  - `racer`: Standard competitor (`race:play`, `score:submit`, `approval:request`, `upload:file`, `workspace:view`).
  - `guest`: Read-only public access (`score:view`, `upload:view`).
- **Protected Route Guards**:
  - Middleware intercepts `Authorization: Bearer <token>` header.
  - Invalid/expired token returns `401 Unauthorized`.
  - Missing role permissions returns `403 Forbidden`.
  - Auth events emit structured audit logs (`SYSTEM`, `WORKFLOW`, `AUTH`).

## Runtime Boundaries
- **Docker Compose Networking & Port Contracts**:
  - Dynamic host port allocation: `"${AIDLC_FRONTEND_PORT:-0}:3000"`, `"${AIDLC_API_PORT:-0}:8000"`, `"${AIDLC_DB_PORT:-0}:5432"`.
  - Fixed internal container ports: Frontend = `3000`, API = `8000`, Database = `5432`.
  - Fixed IPv4 loopback healthchecks:
    - Frontend: `http://127.0.0.1:3000/health`
    - API: `http://127.0.0.1:8000/health`
    - Database: `pg_isready -U neon_racer -d car_neon_city_racer`
- **Storage Boundary**:
  - Mount path: `/app/uploads` (host: `./uploads`).
  - Max upload size: 10MB (`MAX_FILE_SIZE_BYTES=10485760`).
  - Permitted MIME types: `image/png`, `image/jpeg`, `image/webp`, `application/json`, `text/plain`.
- **Audit Logging Boundary**:
  - Immutable audit trail capturing timestamp, category, action, userId, role, ipAddress, success status, and details.


# Project Protocol Intelligence

## Technology Direction
Frontend: JavaScript / TypeScript.
Backend: Node.js + Express, JWT.
Database: PostgreSQL.
Deployment runtime: Docker Compose with environment-specific manifests and deterministic port allocation.
Verification: npm test; lint/static checks: npm run lint.

## Naming Conventions
Use clear domain-first names for modules, routes, API resources, database tables, tickets, branches, and deployment environments.
Use kebab-case for routes and branches, PascalCase for UI components, snake_case for database columns, and stable ticket IDs in commit/release notes.
Name seed users, roles, permissions, env vars, Docker services, and health endpoints explicitly so reviewers can test without guessing.

## Architecture Standards
- Preserve a documented frontend/backend/database boundary.
- Frontend must follow JavaScript / TypeScript conventions and avoid legacy visual patterns.
- Backend must expose typed API contracts, layered business logic, validation, and health endpoints.
- Database design must include ownership, indexes, seed data, migrations, and rollback-safe changes.
- Deployment must be container-first with environment manifests for local, dev, UAT, staging, and production.

## Development Protocols
- Every milestone and ticket must inherit these standards.
- Agents must update docs, memory, graph context, tests, and release evidence when code changes.
- Use npm test and npm run lint as baseline verification unless a ticket explicitly changes the test policy.
- Build/runtime entrypoint: `npm run build`
- Validation gates: `npm test`, `npm run lint`

## Risks
- Technical risk: placeholder architecture creates hallucination in downstream tickets, so docs must explicitly preserve stack and domain boundaries.
- Product risk: approval and audit flows can be under-specified unless the roadmap keeps them as first-class milestones.
- Operational risk: local and dev deployment assumptions drift unless Docker commands remain authoritative.

