# Development Protocols

## Branching
- Use short-lived task branches off `main`.
- Tickets and milestone tasks should map cleanly to commits and PR-sized changes.
- Keep infrastructure and app changes traceable in the same branch only when they must ship together.

## Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
- Local path: `/home/ubuntu/2026/product-aidlc/projects/car-neon-city-racer`

## Coding Standards
- Preserve the selected stack: JavaScript / TypeScript, Node.js + Express, JWT, PostgreSQL.
- Favor small diffs, explicit contracts, and typed boundaries.
- Keep docs, tests, and deployment instructions in sync with code changes.

## Review Gates
- No merge without passing lint/build/test commands.
- Approval, auth, and audit changes require explicit verification notes.
- Generated docs must stay aligned with the source product context and milestones.

