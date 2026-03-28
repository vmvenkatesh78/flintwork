# ADR-005: Portal Without Positioning

**Status:** Accepted  
**Date:** 2025-03-28  
**Context:** Deciding whether flintwork should bundle a positioning engine for dropdown components (Tooltip, Menu, Popover, Select).

## Decision

Provide Portal for stacking context escape. Do not bundle a positioning library. Consumers are responsible for positioning dropdown content relative to triggers, either via CSS or a library like @floating-ui/react.

## What Portal Solves

Portal renders content at the end of a specified container element (defaulting to `document.body`). This breaks out of parent `overflow: hidden`, `z-index` stacking contexts, and CSS `transform` containers that would otherwise clip or misposition the dropdown content.

Portal also handles conditional rendering. Content only mounts when the component is open, preventing invisible DOM nodes from accumulating.

## What Portal Does Not Solve

Portal does not position the content relative to the trigger. Content renders at the portal target (typically `document.body`) with no `top`, `left`, or `transform` values. Without explicit positioning, dropdown content appears at the top-left corner of the viewport.

Positioning requires knowing the trigger's bounding rect, viewport boundaries, scroll position, and collision detection. This is a complex problem with a mature solution (@floating-ui/react, formerly Popper.js).

## Reasoning

**Positioning is a separate concern from component behavior.** Focus trapping, keyboard navigation, ARIA attributes, and state management are the component library's job. Spatial positioning is a layout concern that depends on the consumer's specific context (fixed headers, scroll containers, iframe boundaries).

**Bundling @floating-ui/react adds 8-12KB to the library.** For consumers who only use Dialog (centered on screen) and Accordion (no positioning needed), this is dead weight. Tree-shaking helps but doesn't eliminate the integration code.

**Consumers who need positioning already have @floating-ui/react.** It's the de facto standard. Adding a second positioning system inside flintwork would conflict with their existing setup.

**The docs site demonstrates the alternative.** Portal with a custom container ref provides inline positioning without any library:

```tsx
const containerRef = useRef<HTMLDivElement>(null);

<div ref={containerRef} style={{ position: 'relative' }}>
  <Menu>
    <Menu.Trigger>...</Menu.Trigger>
    <Menu.Portal container={containerRef.current!}>
      <Menu.Content style={{ position: 'absolute', top: '100%' }}>
        ...
      </Menu.Content>
    </Menu.Portal>
  </Menu>
</div>
```

This pattern works for most cases. Only edge cases (viewport collision, scroll containers, nested transforms) require @floating-ui/react.

## Trade-offs

- Out of the box, dropdown components do not "just work" visually. The consumer must either use the container ref pattern or add @floating-ui/react. This is a higher barrier to entry compared to Radix (which bundles positioning).
- The docs site itself uses the container ref pattern as a workaround, which demonstrates the limitation.
- If most consumers end up needing @floating-ui/react anyway, the library could offer a first-party integration package in the future (`flintwork-floating` or similar) without breaking the core package.

## Alternatives Considered

- **Bundle @floating-ui/react**: Rejected. Adds weight, couples to a specific positioning library, conflicts with consumers who already use it.
- **Custom positioning engine**: Rejected. Positioning is a solved problem. Reimplementing it is engineering effort with no differentiation value and guaranteed edge case bugs.
- **CSS Anchor Positioning (CSS spec)**: Premature. Browser support is insufficient as of March 2025. When support reaches 90%+, this becomes the ideal solution because it requires zero JavaScript. Worth revisiting in 2026.