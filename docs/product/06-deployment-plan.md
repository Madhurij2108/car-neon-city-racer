# Deployment Plan

## Environments
- Local: Docker Compose workspace for feature build and QA loop.
- Dev: shared environment mirroring local compose contracts.
- Staging: pre-production verification with seeded but safe data.
- Production: controlled rollout with audit-safe rollback notes.

## Build
- Primary build orchestration: `npm run build`
- Expected stack artifacts: frontend bundle, backend service image/process, PostgreSQL schema state.

## Release
- Owner: engineering / release operator.
- Promote only after docs, milestones, tests, and ticket evidence agree.
- For this product, approval, uploads, and audit flows are mandatory smoke paths before promotion.

## Rollback
- Rollback should restore the previous application version and preserve audit-safe data.
- If schema changes are introduced, include reversible migration notes before release.

## Verification
- Run `npm test` and `npm run lint`.
- Smoke-test sign in, project creation, approval request flow, file upload path, reviewer comments, and audit event visibility.

