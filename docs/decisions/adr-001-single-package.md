# ADR-001: Single Package Over Monorepo

**Status:** Accepted  
**Date:** 2025-03-01  
**Context:** Initial project structure decision for the flintwork design system.

## Decision

Ship as a single npm package with clean internal folder separation, not a monorepo with independently versioned sub-packages.

## Reasoning

A monorepo (via Turborepo or Nx) makes sense when multiple consumers need to install different subsets independently — a company with 15 product teams where some only need tokens and some only need components. That's not this project's use case.

The monorepo tax is concrete: workspace config, cross-package dependency management, independent versioning strategy, publish coordination. That's setup time with no return for a single-author package.

The internal folder structure provides the same architectural separation:

```
src/
├── tokens/        → token pipeline
├── primitives/    → headless components
├── styled/        → styled layer
└── index.ts       → public API
```

Clean entry points give consumers selective imports without the multi-package overhead:

```ts
import { Dialog } from 'flintwork'
import 'flintwork/tokens'
```

## Trade-offs

- Consumers cannot install only tokens without the component code being in `node_modules`. Acceptable because the package is tree-shakeable — unused components don't end up in their bundle.
- If the project grows to need independent versioning per layer, migration to a monorepo is straightforward because the internal structure already mirrors the split.

## Alternatives Considered

- **pnpm workspaces + Turborepo**: Rejected. Overhead doesn't justify the benefit at this scale.
- **Multiple standalone repos**: Rejected. Cross-repo coordination for a single-author project is worse than monorepo overhead.
