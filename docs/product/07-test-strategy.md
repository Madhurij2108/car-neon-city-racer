# Test Strategy

## Test Pyramid
- Unit: domain logic, auth helpers, validation, permission checks.
- Integration: API + database behavior for projects, approvals, uploads, comments, and audit events.
- E2E: browser-driven flows for authentication, project lifecycle, approval review, and file handling.

## Unit Tests
- Cover auth and role guard logic.
- Cover approval state transitions and validation rules.
- Cover audit-event generation for sensitive actions.

## Integration Tests
- Verify REST API contracts against PostgreSQL persistence.
- Verify upload metadata, reviewer actions, and approval status changes.
- Verify unauthorized access is rejected consistently.

## E2E Tests
- Sign up / sign in / sign out.
- Create workspace/project and invite members where applicable.
- Submit approval request, assign reviewer, comment, approve/reject.
- Upload a document and verify audit trail visibility.

## Quality Gates
- `npm run lint` passes
- `npm test` passes
- `npm run build` succeeds
- critical approval and audit smoke paths pass before release

