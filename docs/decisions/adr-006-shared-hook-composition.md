# ADR-006: Shared Hook Composition Across Components

**Status:** Accepted  
**Date:** 2025-03-28  
**Context:** Deciding how to share behavior logic across Dialog, Popover, Menu, and Select without duplication.

## Decision

Implement reusable behavior as internal hooks. Components compose these hooks to build their interaction model. Behavioral differences between components are expressed through ARIA attributes and trigger behavior, not through different hook implementations.

## The Shared Hook Set

Four hooks power all eight components:

| Hook | Used by | Behavior |
|------|---------|----------|
| `useFocusTrap` | Dialog, Popover, Menu, Select | Traps Tab/Shift+Tab within container, restores focus on deactivation |
| `useClickOutside` | Dialog, Popover, Menu, Select | Detects mousedown/touchstart outside a container element |
| `useRovingTabIndex` | Tabs, Menu, Select | Arrow key navigation with single active tabstop, Home/End support |
| `useControllable` | All 8 components | Supports both controlled (`value` prop) and uncontrolled (`defaultValue`) patterns |

## Composition Pattern

Dialog, Popover, and Menu all use the same three mechanisms in their Content component:

```tsx
// All three components do this:
useFocusTrap(contentRef, { enabled: true });
useClickOutside(contentRef, () => onOpenChange(false));

useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onOpenChange(false);
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [onOpenChange]);
```

The behavioral difference between these components is entirely in their ARIA layer:

| Component | role | aria-modal | aria-haspopup | Trigger behavior |
|-----------|------|------------|---------------|-----------------|
| Dialog | `dialog` | `true` | `dialog` | Opens only |
| Popover | none | none | `dialog` | Toggles |
| Menu | `menu` | none | `menu` | Toggles |
| Select | `listbox` | none | `listbox` | Toggles |

## Reasoning

**Identical behavior should come from identical code.** If Dialog and Popover both need "close on Escape, close on click outside, trap focus," that logic should live in one place. Copying it into each component creates drift: one component gets a bug fix, the other doesn't.

**ARIA is the differentiator, not behavior.** A screen reader user experiences Dialog and Popover differently because of `role` and `aria-modal`, not because focus trapping works differently. The hooks provide the mechanical behavior. The component provides the semantic meaning.

**New components compose existing hooks.** When Menu was built, it needed focus trapping (already had it), click outside dismissal (already had it), and roving tabindex (already had it from Tabs). The only new code was typeahead search, which was added to MenuContent directly because it's specific to menu/listbox patterns and doesn't belong in the generic roving hook.

**Hooks are internal, not public.** Consumers don't call `useFocusTrap` directly. They use `<Dialog.Content>` which calls it internally. This means hook APIs can change without breaking the public interface. If `useFocusTrap` needs a new parameter, only the components that call it need updating, not consumer code.

## Typeahead as a Non-Shared Pattern

Typeahead search (type a character to jump to a matching item) is used by Menu and Select but was deliberately not added to `useRovingTabIndex`. Typeahead is specific to menu and listbox patterns. Tabs and toolbars don't use it. Adding it to the roving hook would pollute a generic utility with pattern-specific behavior.

Instead, typeahead is implemented as a keydown handler directly in MenuContent and SelectContent. Both implementations are structurally identical (same 500ms buffer timeout, same textContent matching logic). If a third component needs typeahead, the logic should be extracted into a `useTypeahead` hook at that point. Two instances is coincidence; three is a pattern.

## Trade-offs

- Hook-based composition means the same event listeners are attached multiple times (useFocusTrap adds keydown, the Escape handler adds keydown, useClickOutside adds mousedown). This is three document-level listeners per open popup. Acceptable because popups are ephemeral and at most one or two are open simultaneously.
- If a component needs slightly different focus trap behavior (e.g., "trap focus but allow Tab to exit"), the current `useFocusTrap` has no configuration for this. The hook would need a new option or the component would need to reimplement trapping. This hasn't been needed yet.

## Alternatives Considered

- **Base component class with inheritance**: Rejected. React doesn't use class inheritance for component composition. Hooks are the idiomatic React primitive for behavior reuse.
- **Higher-order components (withFocusTrap, withClickOutside)**: Rejected. HOCs are harder to type, create wrapper elements in the DOM, and compose less cleanly than hooks.
- **Render props for behavior injection**: Rejected. Render prop APIs are verbose and nest deeply when composing multiple behaviors. Hooks compose linearly.
- **Single mega-hook (usePopup) that combines all behaviors**: Rejected. Different components need different subsets. Dialog doesn't need roving tabindex. Tabs doesn't need click outside. A mega-hook either accepts too many configuration flags or forces unused behavior onto every consumer.