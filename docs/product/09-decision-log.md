# Decision Log

## Decision
Adopt JavaScript / TypeScript for frontend delivery, Node.js + Express, JWT for backend APIs, and PostgreSQL for persistence within a Docker-first local/dev workflow.

## Context
The product must be secure, agent-buildable, and operationally explicit. The stack and runtime commands are already part of the captured product contract and should remain stable across milestones.

## Options
- Option A: Keep the captured stack and focus on documented delivery quality.
- Option B: Re-open stack exploration and delay implementation clarity.
- Option C: Build a thinner prototype that ignores approval/audit depth.

## Outcome
Option A is the current path. Follow-up decisions should only adjust architecture after docs, tests, and compile outputs reveal a real constraint.

