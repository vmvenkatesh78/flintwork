# ADR-004: Styled Layer via Data Attributes with Intermediate Variables

**Status:** Accepted  
**Date:** 2025-03-28  
**Context:** Choosing how the styled layer connects to the headless primitives and consumes design tokens.

## Decision

Styled wrappers add a single `data-fw-*` attribute to each component element. CSS targets these attributes using "Option B" intermediate `--_` variables that scope token values to the element and prevent leakage to children.

## Implementation

Each styled wrapper is a thin function that renders the primitive with one additional data attribute:

```tsx
function StyledContent(props) {
  return <MenuPrimitive.Content data-fw-menu-content="" {...props} />;
}
```

CSS targets the data attribute and maps component tokens to scoped intermediate variables:

```css
[data-fw-menu-content] {
  --_bg: var(--fw-menu-bg);
  --_radius: var(--fw-menu-radius);
  --_shadow: var(--fw-menu-shadow);

  background: var(--_bg);
  border-radius: var(--_radius);
  box-shadow: var(--_shadow);
}
```

## Why Data Attributes Over CSS Classes

Data attributes are invisible to assistive technology. They exist purely for CSS targeting. CSS classes risk collision with consumer class names and create ambiguity about ownership (is `.button` the library's class or the consumer's?). Data attributes with the `fw-` namespace are unambiguous.

Data attributes also serve double duty as component identification markers. A DOM inspector shows `data-fw-menu-content=""` and immediately communicates which flintwork component rendered that element. No mapping from class name to component needed.

## Why Option B Intermediate Variables

Two approaches were evaluated for consuming component tokens in CSS:

**Option A (direct):** Properties reference component tokens directly.
```css
[data-fw-menu-content] {
  background: var(--fw-menu-bg);
  border-radius: var(--fw-menu-radius);
}
```

**Option B (intermediate):** Properties reference scoped `--_` variables that resolve to component tokens.
```css
[data-fw-menu-content] {
  --_bg: var(--fw-menu-bg);
  background: var(--_bg);
}
```

Option B was chosen because CSS custom properties inherit. If a menu item contains a nested component that also references `--fw-menu-bg`, it would inherit the parent's value. Intermediate `--_` variables are scoped to the element's selector block and do not inherit, preventing token leakage across component boundaries.

The `--_` prefix convention (underscore = private) is borrowed from Lea Verou's Open Props pattern. It signals "this variable is internal to this selector, do not reference it from outside."

## Trade-offs

- Slightly more CSS per component (two lines instead of one per property). Acceptable because it prevents subtle inheritance bugs that are hard to debug.
- Data attributes add bytes to the DOM. Negligible in practice (one attribute per component element, not per instance).
- Consumers who want to override styles target `[data-fw-menu-content]` instead of a class. This is intentionally verbose to discourage casual overrides while still being possible.

## Alternatives Considered

- **CSS classes with BEM naming**: Rejected. Collision risk with consumer styles. No namespace isolation without a build tool.
- **CSS Modules**: Rejected. Requires build tool integration. Not framework-agnostic. Consumers cannot override styles without `!important` or module composition.
- **CSS-in-JS (styled-components, Emotion)**: Rejected. Runtime overhead. React tree coupling. Breaks the zero-runtime-CSS constraint.
- **Option A direct token references**: Rejected. Token inheritance across nested components causes visual bugs that are hard to trace.