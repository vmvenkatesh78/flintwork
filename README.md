# flintwork

A design system built from scratch. Headless primitives with token-driven theming and keyboard-first accessibility.

## What this is

Flintwork is a React component library with two layers:

- **Primitives** — headless components that handle behavior, keyboard interactions, focus management, and ARIA attributes. No styling opinions. You bring your own CSS.
- **Styled components** — a styled layer that consumes the primitives and applies a token-driven visual design. Every style value comes from a design token. Theme switching is a single attribute swap.

The token pipeline is custom-built. JSON token files feed into a build script that outputs CSS custom properties with full theme support. No Style Dictionary, no CSS-in-JS runtime.

## Install

```bash
pnpm add flintwork
```

## Usage

```tsx
import { Button } from 'flintwork';
import 'flintwork/tokens';
import 'flintwork/styles';
```

## Token architecture

Tokens follow a three-tier model:

```
Global    →  raw palette values (blue-500, spacing-4, radius-md)
Semantic  →  intent-based mappings (color-text-primary, color-bg-error)
Component →  component-specific bindings (button-bg, button-text)
```

Theme switching remaps the semantic layer. Components reference semantic tokens, so swapping `[data-theme="dark"]` on the root element updates everything without touching component styles.

```html
<div data-theme="dark">
  <!-- all components automatically use dark token values -->
</div>
```

## Token customization

Import the CSS and override any custom property:

```css
:root {
  --fw-color-interactive-default: #6366f1;
}
```

## Development

```bash
pnpm install
pnpm build:tokens   # build CSS custom properties from JSON tokens
pnpm build          # build tokens + library
pnpm test           # run tests
pnpm typecheck      # type check without emitting
```

## Project structure

```
src/
├── tokens/
│   ├── global/         # Tier 1 — raw palette, spacing, typography, radii, shadows
│   ├── semantic/       # Tier 2 — intent mappings, light.json and dark.json
│   └── component/      # Tier 3 — component-specific token bindings
├── primitives/         # Headless components (Phase 2)
├── styled/             # Styled layer consuming primitives (Phase 3)
├── hooks/              # Internal behavior hooks (useFocusTrap, useRovingTabIndex, etc.)
├── utils/              # DOM utilities (portal, merge-refs, etc.)
├── scripts/
│   └── build-tokens.ts # Token build pipeline
└── index.ts            # Public API
```

## Principles

- Every style value comes from a token. No hardcoded colors, no magic numbers.
- Accessibility is structural, not bolted on. Primitives enforce correct ARIA and keyboard behavior.
- Headless first. Behavior and presentation are separate concerns.
- Zero runtime dependencies. React is the only peer dep.
- Tree-shakeable. Import what you use, nothing else ships.

## License

MIT
