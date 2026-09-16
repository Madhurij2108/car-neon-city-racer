# Agent Guardrails

## Allowed Actions
- Edit code and docs only within `/home/ubuntu/2026/product-aidlc/projects/car-neon-city-racer`.
- Use declared build, test, and lint commands as the source of truth.
- Update product docs, milestone plans, and tickets when implementation changes the contract.

## Blocked Actions
- Do not expose secrets or provider API keys in client bundles.
- Do not bypass role checks, approval workflows, or audit logging.
- Do not introduce undocumented deployment commands or ad hoc runtime assumptions.

## Security
Never expose secrets, tokens, or provider API keys in frontend bundles; enforce authentication and authorization checks on protected actions; preserve auditability for sensitive workflow and data changes; restrict file handling to the product workspace and documented storage paths; build and deploy only through reproducible Docker scripts.

# Project Standards And Guardrails

## Best Practices
Implement real backend flows instead of placeholders, keep code modular, and document decisions that affect future agents.
Use migrations/seed scripts for repeatable local/dev data, validate inputs at API boundaries, and expose useful loading/empty/error states.
Keep generated UI modern, readable, responsive, accessible, and suitable for daily operational use.

## Design Standards
Design profile: Enterprise SaaS operational dashboard.
Use a modern left navigation shell, clear active states, readable cards/tables, compact action bars, strong empty/loading/error states, and accessible contrast.
Avoid legacy admin templates, unclear buttons, crowded modals, hidden critical actions, and decorative UI that reduces task clarity.

## Safety And Quality Guardrails
- Do not ship fake backends, hardcoded credentials, or untestable placeholder flows.
- Provide seed/test data and login/reviewer notes for every previewable product.
- Maintain auth, authorization, accessibility, error handling, and deployment rollback paths.
- Capture evidence for build, test, preview URL, release state, and human review.

### Product-Specific Security Expectations
- JWT/session handling must remain server-controlled.
- File upload and document access must be permission-aware.
- Audit events must be immutable enough for investigation.

## Human Approval
- Production environment changes
- Access-control model changes
- Data-destructive migrations or rollback plans
- Any change that weakens auditability or security posture

