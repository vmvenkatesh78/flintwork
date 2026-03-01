# ADR-003: Three-Tier Token Architecture with Custom Pipeline

**Status:** Accepted  
**Date:** 2025-03-01  
**Context:** Defining how design tokens are structured, resolved, and consumed in flintwork.

## Decision

Implement a three-tier token model (Global → Semantic → Component) with JSON source files and a custom Node build script that outputs CSS custom properties.

## Token Tiers

### Tier 1 — Global (Primitives)

Raw palette values. Define what values exist, not what they're for.

```json
{ "color": { "blue": { "500": { "$value": "#217CF5" } } } }
```

### Tier 2 — Semantic (Aliases)

Intent-based mappings. Define what values are used for. References resolve to global tokens.

```json
{ "color": { "interactive": { "default": { "$value": "{color.blue.500}" } } } }
```

Separate files per theme (light.json, dark.json). Theme switching remaps semantic tokens to different global values. Token names stay the same across themes.

### Tier 3 — Component

Component-specific bindings. References resolve to semantic tokens.

```json
{ "button": { "bg": { "$value": "{color.interactive.default}" } } }
```

## Build Pipeline

A custom Node script (~150 lines) reads JSON files, resolves the reference chain, and outputs flat CSS custom properties:

```css
:root {
  --fw-color-blue-500: #217CF5;
  --fw-color-interactive-default: #217CF5;
  --fw-button-bg: #217CF5;
}

[data-theme="dark"] {
  --fw-color-interactive-default: #4C97FF;
  --fw-button-bg: #4C97FF;
}
```

Components consume tokens via `var()`:

```css
.button { background-color: var(--fw-button-bg); }
```

Theme switching swaps the `data-theme` attribute on the root element. The browser re-resolves all `var()` references. No JavaScript runtime involved.

## Reasoning

**Custom pipeline over Style Dictionary.** Style Dictionary is the industry standard, but for this project the pipeline itself is a portfolio piece. A hand-written ~150-line Node script demonstrates understanding of token resolution, reference chains, and multi-theme output generation. The script is simple enough to maintain without a framework.

**CSS custom properties over CSS-in-JS.** No runtime overhead. Theme switching is a DOM attribute swap, not a React re-render. Consumers can override any token with standard CSS. No build tool coupling.

**JSON source format aligned with W3C spec.** Uses `$value`, `$type`, and `{reference}` syntax from the W3C Design Tokens Community Group specification. If the spec matures into a standard, migration is minimal.

## Trade-offs

- JSON files with references require a build step. Consumers cannot edit tokens at runtime without the build pipeline. Acceptable — runtime token editing is not a use case for this system.
- Custom pipeline means maintaining the build script. At ~150 lines with clear structure, this is manageable. If complexity grows beyond 300 lines, migrating to Style Dictionary is the fallback.

## Alternatives Considered

- **Style Dictionary**: Rejected for v1. Adds a dependency with zero storytelling value. The custom pipeline is the differentiator.
- **CSS-in-JS theme objects (styled-components ThemeProvider)**: Rejected. Runtime overhead, React tree coupling, poor interop with non-React consumers.
- **Tailwind config as token source**: Rejected. Couples the token system to a specific utility framework. Tokens should be framework-agnostic.
