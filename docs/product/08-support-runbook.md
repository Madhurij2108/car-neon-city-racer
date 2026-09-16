# Support Runbook

## Known Failures
- Login succeeds but protected routes fail due to token/session mismatch.
- Approval workflow updates but audit events are missing.
- File metadata is saved but storage or access checks fail.
- Reviewer/project permissions drift from expected RBAC rules.

## Diagnostics
- Re-run `npm test` and inspect failing gate output.
- Review application logs around auth, approval, and upload endpoints.
- Check database records for project, approval, review, and audit event consistency.

## Recovery
- Roll back to the last verified application build if approval or audit integrity is compromised.
- Reconcile incomplete approval workflows before resuming normal operations.
- Restore deployment using documented Docker/runtime commands only.

## Escalation
- Engineering owner for auth, approval, or data-integrity failures.
- Product owner for workflow ambiguity or broken business rules.
- Human review gate before any production data repair.

