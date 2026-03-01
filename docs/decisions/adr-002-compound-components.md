# ADR-002: Compound Components with Internal Hooks

**Status:** Accepted  
**Date:** 2025-03-01  
**Context:** Choosing the public API pattern for flintwork's component primitives.

## Decision

Use Radix-style compound components as the public API. Implement behavior logic via internal hooks that are not exported.

## Public API Pattern

Each component exposes sub-components via dot notation:

```tsx
<Dialog.Root>
  <Dialog.Trigger>
    <button>Open</button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Heading</Dialog.Title>
    <Dialog.Description>Body text</Dialog.Description>
    <Dialog.Close>
      <button>Close</button>
    </Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
```

State is shared between sub-components via React context. `Root` provides context, child components consume it.

## Internal Behavior Layer

Keyboard interactions, focus management, and reusable behavior patterns are implemented as hooks:

- `useFocusTrap` — traps focus within a container, loops on Tab, auto-focuses on mount
- `useRovingTabIndex` — arrow key navigation with single active tabstop
- `useClickOutside` — detects pointer events outside a referenced element
- `useControllable` — supports both controlled and uncontrolled state patterns

These hooks power the compound components internally but are not part of the public API. Consumers interact exclusively through the compound component interface.

## Reasoning

**Compound components enforce accessibility structurally.** `Dialog.Content` always renders with `role="dialog"`, `aria-modal="true"`, and focus trapping. The consumer cannot skip these. Compare this to a hooks-only API where the consumer must remember to spread the right props onto the right elements.

**Internal hooks keep implementation clean.** `useFocusTrap` is used by both Dialog and Popover. Extracting behavior into hooks avoids duplicating logic across components while keeping the public API simple.

**Composition over configuration.** A single `<Dialog>` component with 30 props for every possible variation is rigid and hard to maintain. Compound components give consumers full control over structure and content while the primitives handle behavior.

## Alternatives Considered

- **Hooks-only public API (React Aria style)**: Rejected for public API. Consumers must correctly apply returned props to the right elements. Accessibility becomes opt-in rather than structural. However, this approach is used internally for code reuse.
- **Monolithic components with render props**: Rejected. Render prop APIs are harder to read, harder to type, and less composable than compound components.
