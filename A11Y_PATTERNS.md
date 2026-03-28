# A11Y_PATTERNS.md

Accessibility patterns, edge cases, and verifiable assertions from flintwork's implementation. This is living documentation: every pattern discovered during component development is recorded here for two purposes: (1) raw material for the a11y-enforce linting tool, and (2) interview and article content.

Started: March 2026
Last updated: March 28, 2026

---

## Dialog

### Focus trap activation

**Pattern:** When a modal dialog opens, focus must move inside the dialog panel. The user should never have to Tab into the dialog manually.

**Implementation:** `useFocusTrap` activates when `DialogContent` mounts. Priority chain for initial focus target:
1. `initialFocusRef` (explicit override)
2. `[data-autofocus]` element inside the container
3. First tabbable element
4. Container itself (with programmatic `tabindex="-1"`)

**Edge case discovered:** If the dialog content has no tabbable elements at all (e.g., a read-only confirmation with only a message and no buttons), the container itself must receive focus. The hook adds `tabindex="-1"` to the container if it doesn't already have one. Without this, focus would stay on the trigger and the dialog would be invisible to screen reader users.

**Verifiable assertion:** After dialog opens, `document.activeElement` must be inside the dialog content panel. If `[data-autofocus]` exists, `document.activeElement` must be that element.

**Test:** `dialog.test.tsx` > "focuses the first tabbable element inside content", "focuses [data-autofocus] element if present"


### Focus trap wrapping

**Pattern:** Tab and Shift+Tab must cycle within the dialog. Tab on the last tabbable element wraps to the first. Shift+Tab on the first wraps to the last.

**Implementation:** Keydown listener on `document` (capture phase) intercepts Tab events. Checks if `activeElement` is the first or last tabbable element and wraps accordingly.

**Edge case discovered:** If focus somehow escapes the trap (browser extension, programmatic focus from third-party code), a `focusin` listener on `document` detects when focus lands outside the container and pulls it back to the first tabbable element. This is the "escape hatch guard" that catches scenarios the keydown handler can't prevent.

**Verifiable assertion:** While dialog is open, `document.activeElement` must always be inside the dialog content panel. Pressing Tab on the last focusable element must move focus to the first. Pressing Shift+Tab on the first must move focus to the last.

**Test:** `dialog.test.tsx` > "traps Tab within content", "traps Shift+Tab within content"


### Focus restoration on close

**Pattern:** When a dialog closes, focus must return to the element that triggered it. This is critical for keyboard users who would otherwise lose their position on the page.

**Implementation:** `useFocusTrap` stores `document.activeElement` in a ref on activation. On cleanup (dialog closes), it calls `.focus()` on the stored element, but only if `isConnected` is true (the element is still in the DOM).

**Edge case documented (not yet handled):** If the trigger element is removed from the DOM before the dialog closes (e.g., a button inside a list item that gets deleted), focus restoration fails silently. The correct fallback chain would be: closest focusable ancestor, then next focusable sibling, then `document.body`. Documented in the TODO section of `use-focus-trap.ts`. Will implement alongside nested dialog support.

**Verifiable assertion:** After dialog closes, `document.activeElement` must be the element that was focused before the dialog opened. If that element is no longer in the DOM, focus must land on a reasonable fallback (not lost to `document.body` without intent).

**Test:** `dialog.test.tsx` > "restores focus to trigger on close", "restores focus to trigger when closing via close button"


### Escape key dismissal

**Pattern:** Pressing Escape must close the dialog. This is a WAI-ARIA requirement for modal dialogs. There is no prop to disable this behavior.

**Implementation:** `DialogContent` attaches a keydown listener for Escape. Calls `event.stopPropagation()` before closing to prevent Escape from propagating to parent dialogs (future nested dialog support).

**Design decision:** If a consumer needs to prevent Escape dismissal (e.g., unsaved changes confirmation), they handle it in their `onOpenChange` callback by not updating state. The dialog calls `onOpenChange(false)`, but the consumer can choose not to close. This keeps the API surface clean: the dialog always "wants" to close on Escape, the consumer decides whether to allow it.

**Verifiable assertion:** Pressing Escape when a dialog is open must call `onOpenChange(false)`. The dialog content must unmount unless the consumer explicitly prevents it.

**Test:** `dialog.test.tsx` > "closes on Escape key", "consumer can prevent dismissal by not updating state"


### Click outside dismissal

**Pattern:** Clicking outside the dialog panel must close it. The overlay is "outside" the content.

**Implementation:** `useClickOutside` on `DialogContent`. Uses `mousedown` instead of `click` to capture intent at press time. Uses capture phase to intercept before `stopPropagation` in children.

**Edge case discovered:** Using `click` instead of `mousedown` causes a false positive: if a user presses inside the dialog, drags outside, and releases, the `click` fires outside the content and incorrectly dismisses the dialog. `mousedown` captures intent at the moment of press, not release. Similarly, `touchstart` is used for mobile.

**Design decision:** `DialogOverlay` does NOT handle click-to-dismiss. That responsibility belongs entirely to `useClickOutside` on `DialogContent`. Clicking the overlay triggers dismissal because the overlay is outside the content panel, and `useClickOutside` detects this. This separation means the overlay is purely decorative (`aria-hidden="true"`).

**Verifiable assertion:** Clicking the overlay dismisses the dialog. Clicking inside the content does not. Pressing inside content and dragging to overlay and releasing does not dismiss.

**Test:** `dialog.test.tsx` > "closes on click outside content", "does not close on click inside content"


### ARIA attributes on dialog

**Pattern:** Modal dialog must have `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the title, and `aria-describedby` pointing to the description.

**Implementation:** `DialogContent` renders a `<div>` with all four attributes. IDs are generated via `useId()` in the root component and shared via context. `DialogTitle` renders `<h2 id={titleId}>`. `DialogDescription` renders `<p id={descriptionId}>`.

**Design decision:** `aria-describedby` always points to the description ID even if `Dialog.Description` is not rendered. This means the attribute references a non-existent ID, which is harmless (screen readers ignore broken references). The alternative would be conditional rendering of `aria-describedby` based on whether Description is mounted, which requires a registration mechanism and adds complexity for no user-facing benefit.

**Verifiable assertion:** Dialog content must have `role="dialog"`, `aria-modal="true"`. `aria-labelledby` must reference an element with the dialog title text. `aria-describedby` must reference the description element if present.

**Test:** `dialog.test.tsx` > "content has role='dialog' and aria-modal='true'", "content has aria-labelledby pointing to title", "content has aria-describedby pointing to description"


### Trigger ARIA attributes

**Pattern:** The trigger button must have `aria-haspopup="dialog"`, `aria-expanded` reflecting the open state, and `aria-controls` pointing to the content (only when content is in the DOM).

**Implementation:** `DialogTrigger` uses `cloneElement` to add these attributes to its child. `aria-controls` is only set when the dialog is open because the content element doesn't exist in the DOM when the dialog is closed. Pointing `aria-controls` at a non-existent ID is invalid HTML.

**Edge case discovered:** `aria-controls` must be conditional. When the dialog is closed, the content panel is not in the DOM (it's inside a Portal that returns null). Setting `aria-controls` to an ID that doesn't exist in the DOM is technically invalid. The fix: only spread `aria-controls` when `open` is true.

**Verifiable assertion:** Trigger must have `aria-haspopup="dialog"`. `aria-expanded` must be "true" when open, "false" when closed. `aria-controls` must reference the content element's ID only when the dialog is open. `aria-controls` must not be present when the dialog is closed.

**Test:** `dialog.test.tsx` > "trigger has aria-haspopup='dialog'", "trigger has aria-expanded reflecting open state", "trigger has aria-controls pointing to content when open", "trigger does not have aria-controls when closed"


### Overlay is decorative

**Pattern:** The dialog overlay (backdrop) is purely decorative. It must be hidden from assistive technology.

**Implementation:** `DialogOverlay` renders `<div aria-hidden="true">`.

**Verifiable assertion:** Overlay element must have `aria-hidden="true"`.

**Test:** `dialog.test.tsx` > "overlay has aria-hidden='true'"


---

## Tabs

### Roving tabindex

**Pattern:** Only the active tab trigger has `tabindex="0"`. All other triggers have `tabindex="-1"`. This means Tab enters the tablist on the active trigger and Tab exits to the next focusable element outside the tablist (the panel). Arrow keys move between triggers.

**Implementation:** `useRovingTabIndex` manages tabindex values. On mount, ensures exactly one item has `tabindex="0"`. On arrow key press, sets all items to `tabindex="-1"`, then sets the target item to `tabindex="0"` and calls `.focus()`.

**Edge case discovered:** On mount, if no trigger has `tabindex="0"` (e.g., consumer forgot to set initial state), the hook sets it on the first non-disabled item. This prevents a broken state where Tab would skip the entire tablist because nothing is tabbable.

**Verifiable assertion:** Exactly one trigger must have `tabindex="0"` at any time. All other triggers must have `tabindex="-1"`. After arrow key navigation, the newly focused trigger must have `tabindex="0"` and the previously focused trigger must have `tabindex="-1"`.

**Test:** `tabs.test.tsx` > "selected trigger has tabindex='0', others have '-1'"


### Automatic activation

**Pattern:** Arrow keys both move focus AND select the corresponding panel. This is the WAI-ARIA default for most tab interfaces (automatic activation vs manual activation where Enter/Space would be required to select).

**Implementation:** `TabsList` passes an `onActiveChange` callback to `useRovingTabIndex`. When the hook moves focus to a new trigger, it calls this callback. The callback reads `document.activeElement.dataset.value` to get the tab value and calls `onValueChange` to update selection.

**Design decision:** `onActiveChange` reads from `document.activeElement` synchronously. This works because `useRovingTabIndex` calls `.focus()` synchronously before invoking the callback. If the hook ever became async, this would break. Documented in `tabs-list.tsx` comments.

**Verifiable assertion:** After pressing ArrowRight/ArrowLeft, both the focused trigger AND the displayed panel must update. Focus and selection must always be in sync.

**Test:** `tabs.test.tsx` > "ArrowRight moves focus and selects next tab"


### Orientation-aware arrow keys

**Pattern:** Horizontal tabs use ArrowLeft/ArrowRight. Vertical tabs use ArrowUp/ArrowDown. The wrong axis keys must be ignored.

**Implementation:** `getDirectionFromKey` in `use-roving-tabindex.ts` maps keys to directions based on orientation. Returns `null` for keys that don't match the current orientation.

**Verifiable assertion:** In horizontal mode, ArrowUp/ArrowDown must do nothing. In vertical mode, ArrowLeft/ArrowRight must do nothing. Home must always select the first tab. End must always select the last tab.

**Test:** `tabs.test.tsx` > "ArrowUp and ArrowDown do nothing in horizontal mode", "ArrowLeft and ArrowRight do nothing in vertical mode"


### Arrow key wrapping

**Pattern:** Arrow keys wrap around at the ends. ArrowRight on the last tab goes to the first. ArrowLeft on the first tab goes to the last.

**Implementation:** `useRovingTabIndex` with `loop: true`. When `nextIndex` exceeds bounds, wraps using modular arithmetic.

**Verifiable assertion:** ArrowRight on the last trigger must focus the first trigger. ArrowLeft on the first trigger must focus the last trigger.

**Test:** `tabs.test.tsx` > "ArrowRight wraps from last to first", "ArrowLeft wraps from first to last"


### Disabled tabs are skipped

**Pattern:** Arrow keys skip disabled tabs. A disabled tab cannot be selected via click or keyboard.

**Implementation:** `useRovingTabIndex` calls `getRovingItems` which calls `isDisabled`. Disabled items are excluded from the roving set, so arrow keys never land on them. `TabsTrigger` checks `disabled` in its click handler and returns early.

**Implementation detail:** Disabled state is communicated via three attributes: `data-disabled` (for CSS), `aria-disabled="true"` (for assistive technology), and the native `disabled` attribute is NOT used on tab triggers because native disabled prevents focus entirely. Tab triggers use `aria-disabled` to remain in the accessibility tree while being non-interactive.

**Verifiable assertion:** Arrow key navigation must skip triggers with `data-disabled`, `aria-disabled="true"`, or native `disabled`. Clicking a disabled trigger must not change the selected tab.

**Test:** `tabs.test.tsx` > "arrow key skips disabled tab", "click on disabled tab does not select it"


### Panel is focusable

**Pattern:** Tab panels have `tabindex="0"` so they're focusable. After the user presses Tab in the tablist, focus lands on the active panel content, not the next element on the page.

**Implementation:** `TabsPanel` renders `<div tabIndex={0}>`.

**Verifiable assertion:** The active panel must have `tabindex="0"`. Tab from the tablist must land on the active panel.

**Test:** `tabs.test.tsx` > "panel has tabindex='0' for keyboard access"


### ARIA attributes on tabs

**Pattern:** Tablist has `role="tablist"` and `aria-orientation`. Triggers have `role="tab"`, `aria-selected`, `aria-controls`, `type="button"`. Panels have `role="tabpanel"`, `aria-labelledby`.

**Implementation:** IDs are deterministic: `${baseId}-trigger-${value}` and `${baseId}-panel-${value}`. Both trigger and panel compute each other's ID from the shared `baseId` and value string. No registration mechanism needed.

**Design decision:** Deterministic ID generation eliminates the need for a registration system where panels register themselves with the tablist. This avoids timing issues (what if a panel renders after the trigger?) and simplifies the context. The tradeoff: if a trigger exists without a matching panel, `aria-controls` points to a non-existent ID. Acceptable because the alternative is significantly more complex.

**Verifiable assertion:** Every trigger must have `role="tab"`, `aria-selected`, `aria-controls` pointing to a valid panel ID, and `type="button"`. Every panel must have `role="tabpanel"` and `aria-labelledby` pointing to the corresponding trigger ID. Tablist must have `role="tablist"` and `aria-orientation`.

**Test:** `tabs.test.tsx` > full ARIA attributes section


---

## Button

### Polymorphic rendering with correct semantics

**Pattern:** Button can render as any element via the `as` prop. The accessibility attributes must adapt based on what element is rendered.

**Implementation:**
- `<Button>` (default): renders `<button type="button">`. No extra ARIA needed.
- `<Button as="a" href="/home">`: renders `<a href="/home">`. No `role="button"` because an anchor with href is already interactive.
- `<Button as="a">` (no href): renders `<a role="button" tabIndex={0}>`. Dev warning fired. An anchor without href is not natively focusable or interactive.
- `<Button as="div">`: renders `<div role="button" tabIndex={0}>`. Non-interactive elements need explicit role and tabindex.

**Edge case discovered:** `<a>` without `href` is a special case. Most developers assume `<a>` is always interactive, but without `href` it's just an inline element with no keyboard accessibility. The dev-mode warning catches this: "An anchor without href is not accessible."

**Verifiable assertion:** Non-button, non-anchor elements must have `role="button"` and `tabIndex={0}`. Anchors without `href` must have `role="button"` and `tabIndex={0}` and trigger a dev warning. Native buttons must have `type="button"` to prevent accidental form submission.

**Test:** `button.test.tsx` covers polymorphic rendering scenarios


### Loading state

**Pattern:** A loading button must remain focusable but prevent interaction. It must communicate its state to assistive technology.

**Implementation:** When `loading={true}`:
- `aria-busy="true"` is set (announces loading state to screen readers)
- `onClick` is suppressed (click handler returns early)
- `data-loading` is set (for CSS styling)
- Element is NOT disabled (remains in tab order, remains focusable)

**Design decision:** Loading does not use native `disabled` because disabled removes the element from tab order. A screen reader user tabbing through a form would skip a loading button entirely and not know it exists. `aria-busy` keeps them informed.

**Verifiable assertion:** Loading button must have `aria-busy="true"`. Loading button must remain focusable (`tabIndex` unchanged). Clicking a loading button must not fire the `onClick` handler.


### Disabled vs aria-disabled

**Pattern:** Two distinct disabled modes: native `disabled` (removes from tab order) and `aria-disabled` (remains focusable but non-interactive).

**Implementation:** `disabled={true}` sets the native `disabled` attribute on `<button>`. `aria-disabled="true"` is checked in the click handler to prevent interaction but the element stays focusable.

**Use case for aria-disabled:** A button that shows a tooltip explaining why it's disabled. Native disabled prevents hover/focus, so the tooltip would never appear. `aria-disabled` keeps the button focusable so the tooltip trigger works.

**Verifiable assertion:** `disabled` button must not be focusable via Tab. `aria-disabled` button must remain focusable. Neither must fire `onClick`.


---

## Focus Trap (hook)

### Tabbable element detection

**Pattern:** Not every element matching the focusable selector is actually tabbable. Elements can be hidden, disabled, inside closed `<details>`, or inside `[inert]` subtrees.

**Implementation:** `isTabbable` function filters candidates:
- Elements with explicit `tabindex < 0` are excluded
- Hidden inputs (`type="hidden"`) are excluded
- Native disabled elements are excluded
- `display: none` on element or any ancestor (walks up the tree via `getComputedStyle`)
- `visibility: hidden` on the element itself (not ancestors, because children can override)
- Elements inside closed `<details>` (except `<summary>`)
- Elements inside `[inert]` subtrees

**Edge case discovered (jsdom):** `offsetParent` is always `null` in jsdom, so it can't be used to detect hidden elements. The fix: use `getComputedStyle(el).display === 'none'` with a manual ancestor walk instead. More expensive but correct in both browser and test environments.

**Edge case discovered (jsdom):** `el.tabIndex` returns incorrect values for `contenteditable`, `audio[controls]`, and `video[controls]` in jsdom. The fix: only check `tabIndex` on elements with an explicit `tabindex` attribute (`el.hasAttribute('tabindex')`). Natively focusable elements matched by the selector are treated as tabbable regardless of the runtime `tabIndex` value.

**Verifiable assertion:** `getTabbableElements` must return only elements reachable via Tab key. Must exclude `tabindex="-1"`, hidden elements, disabled elements, elements in closed details, and inert elements.


### Deferred edge cases (documented for future)

These are explicitly documented in `use-focus-trap.ts` as known limitations:

1. **Shadow DOM:** `document.activeElement` returns the shadow host, not the focused element inside. Requires recursive `shadowRoot.activeElement` walk. Not needed for v1 (no Shadow DOM usage).

2. **iframe focus containment:** When an iframe inside the trap receives focus, the trap treats it as a single unit. Tabbing out of an iframe may escape the trap. No clean solution without cross-document cooperation.

3. **Positive tabindex ordering:** Elements with `tabindex > 0` should be sorted before `tabindex="0"`. Current implementation uses DOM order. Rare in practice.

4. **Safari button focus:** Safari on macOS doesn't focus `<button>` on click by default. `document.activeElement` stays on the previous element. Workaround: `element.focus()` on mousedown. Deferred until Safari testing surfaces the issue.

5. **Nested trap stack:** When Dialog opens another Dialog, the inner trap should take over. On deactivation, the outer trap resumes. Requires a global trap stack.

6. **Trigger fallback chain:** If the trigger is removed from DOM before deactivation, focus restoration fails. Fallback: closest focusable ancestor, next focusable sibling, `document.body`.


---

## Roving Tabindex (hook)

### Home and End keys

**Pattern:** Home key must focus the first item. End key must focus the last item. These are required by WAI-ARIA for composite widgets.

**Implementation:** `getDirectionFromKey` returns `'home'` or `'end'` for these keys. The navigation logic maps `'home'` to index 0 and `'end'` to `items.length - 1`.

**Verifiable assertion:** Pressing Home must focus the first non-disabled item. Pressing End must focus the last non-disabled item.

**Test:** `tabs.test.tsx` > "Home selects first tab", "End selects last tab"


### Arrow key default prevention

**Pattern:** Arrow keys must not scroll the page when navigating inside a composite widget.

**Implementation:** `event.preventDefault()` is called after confirming the key matches the orientation.

**Verifiable assertion:** ArrowUp/ArrowDown in a vertical tablist must not scroll the page. ArrowLeft/ArrowRight in a horizontal tablist must not scroll the page.


---

## Compound Components (pattern)

### Context boundary enforcement

**Pattern:** Compound sub-components used outside their root must throw a clear error. Otherwise, they fail silently with undefined context values, producing broken ARIA attributes and no interaction.

**Implementation:** Both `useDialogContext` and `useTabsContext` throw: `"[flintwork] X compound components must be used within a <X> root."`

**Verifiable assertion:** Rendering `Dialog.Content` outside `<Dialog>` must throw. Rendering `Tabs.Trigger` outside `<Tabs>` must throw.

**Test:** `dialog.test.tsx` > "throws when compound components are used outside Dialog root", `tabs.test.tsx` > "throws when compound components are used outside Tabs root"


---

## Controlled/Uncontrolled (hook)

### Mode switch detection

**Pattern:** Switching between controlled and uncontrolled mode during a component's lifetime is a bug. The hook detects this and warns in development.

**Implementation:** `useControllable` stores the initial controlled/uncontrolled mode in a ref. On every render, it compares the current mode against the stored mode. If they differ, a console warning fires.

**Verifiable assertion:** Switching from `value={x}` to `value={undefined}` (or vice versa) must produce a dev-mode warning.

**Test:** `use-controllable.test.ts` covers mode switching warning

---

## Tooltip

### Hover vs focus show behavior

**Pattern:** Tooltip must appear on both hover AND focus. Hover-only tooltips are invisible to keyboard users. Focus-only tooltips are invisible to mouse users.

**Implementation:** `TooltipTrigger` attaches `onMouseEnter` (calls `show` with delay) and `onFocus` (calls `showImmediate` with no delay). Keyboard users get the tooltip instantly because they shouldn't wait 700ms after tabbing to an element.

**Edge case discovered (jsdom):** Native `.focus()` does not fire React's synthetic `onFocus` handler in jsdom. Tests need both `trigger.focus()` (sets `document.activeElement`) and `fireEvent.focus(trigger)` (fires the React handler). Without both, either the tooltip doesn't show or `document.activeElement` assertions fail.

**Verifiable assertion:** Hovering the trigger must show the tooltip after `showDelay` ms. Focusing the trigger must show the tooltip immediately (0ms delay). Both paths must result in the tooltip being visible.

**Test:** `tooltip.test.tsx` > "shows tooltip after show delay on mouse enter", "shows tooltip immediately on focus (no delay)"


### Hover-to-stay on content

**Pattern:** When the mouse moves from trigger to tooltip content, the tooltip must not disappear. The user needs to be able to read long tooltip text.

**Implementation:** `TooltipContent` has `onMouseEnter` which calls `show()` (cancels the hide timer). `onMouseLeave` calls `hide()` (restarts the hide delay). The `show` function in root clears all timers before starting a new one, so calling it when already open is a no-op that just cancels any pending hide.

**Verifiable assertion:** Moving mouse from trigger to tooltip content must keep the tooltip visible. Moving mouse away from tooltip content must start the hide delay.

**Test:** `tooltip.test.tsx` > "cancels hide when mouse enters tooltip content", "hides when mouse leaves tooltip content"


### Escape dismisses without moving focus

**Pattern:** Pressing Escape must hide the tooltip without changing which element has focus. This differs from Dialog where Escape closes AND restores focus. Tooltip has no focus trap, so there's nothing to restore.

**Implementation:** Root component attaches a document-level keydown listener for Escape (only while open). Calls `hideImmediate` which clears timers and sets open to false. No focus manipulation.

**Verifiable assertion:** After pressing Escape, the tooltip must not be visible AND `document.activeElement` must be the same element that had focus before Escape was pressed.

**Test:** `tooltip.test.tsx` > "hides on Escape without moving focus"


### Conditional aria-describedby

**Pattern:** `aria-describedby` on the trigger should only reference the tooltip ID when the tooltip is in the DOM. Referencing a non-existent ID is invalid HTML.

**Implementation:** `TooltipTrigger` conditionally spreads `aria-describedby` only when `open` is true: `...(open ? { 'aria-describedby': tooltipId } : {})`. Same tradeoff as Dialog's conditional `aria-controls`.

**Design decision:** Some screen readers cache `aria-describedby` on first focus and won't re-read it when the tooltip appears. This means keyboard users might not hear the tooltip description announced if it appears after focus. The alternative (always setting `aria-describedby` with the tooltip always in the DOM but visually hidden) would fix this but conflicts with Portal-based conditional rendering. Accepted tradeoff for v1.

**Verifiable assertion:** `aria-describedby` must be present on the trigger only when the tooltip is visible. Must not reference a non-existent ID.

**Test:** `tooltip.test.tsx` > "trigger has aria-describedby pointing to tooltip when open", "trigger does not have aria-describedby when closed"


### Show/hide delay prevents flicker

**Pattern:** Tooltip must not appear on accidental mouse pass-through. A delay before showing (700ms default) prevents flicker when the user moves the mouse across the trigger without intending to read the tooltip.

**Implementation:** `show` function in root starts a timer. If `hide` is called before the timer fires (mouse left the trigger), the show timer is cleared and the tooltip never appears. `clearTimers` cancels both show and hide timers on every state transition.

**Edge case:** Without a hide delay (300ms default), moving from trigger to tooltip content would dismiss the tooltip in the gap between the two elements. The hide delay gives the user time to move the mouse from trigger to content.

**Verifiable assertion:** Mouse entering then leaving the trigger within `showDelay` ms must not show the tooltip. Tooltip visible after `showDelay` must remain visible for at least `hideDelay` ms after mouse leaves.

**Test:** `tooltip.test.tsx` > "does not show tooltip if mouse leaves before delay", "hides tooltip after hide delay on mouse leave"


### Tooltip content is non-interactive

**Pattern:** Tooltip must not contain focusable elements. No links, buttons, inputs, or anything interactive. If interactive content is needed, use Popover instead.

**Implementation:** No focus trap in tooltip (unlike Dialog). No `tabIndex` on content (unlike TabsPanel). The tooltip is read-only information. This is enforced by documentation and convention, not by runtime validation.

**Verifiable assertion:** Tooltip content should not contain any elements matching the tabbable selector. This could become a dev-mode warning in future.

---

## Styled Layer

### Data attributes as styling hook

**Pattern:** Styled wrappers add a single data attribute (`data-fw-button`, `data-fw-dialog-content`, etc.) that CSS targets. No classes, no CSS-in-JS runtime.

**Implementation:** Each styled wrapper is a thin function that renders the primitive with one additional data attribute. Example: `<ButtonPrimitive {...props} data-fw-button="" />`. CSS uses `[data-fw-button]` selector.

**Accessibility implication:** Data attributes are invisible to assistive technology. They exist purely for CSS targeting. This is correct: styling hooks must never affect the accessibility tree.

**Verifiable assertion:** Styled wrappers must not add, remove, or modify any ARIA attribute from the underlying primitive. The primitive owns all accessibility. The styled layer owns only presentation.
