import { useRef, useCallback, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Tabbable element detection
// ---------------------------------------------------------------------------

/**
 * Selector for elements that are natively focusable or have an explicit
 * tabindex. This is the broadest possible net — results are then filtered
 * by `isTabbable` to exclude hidden, disabled, and inert elements.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(', ')

/**
 * Checks whether an element is actually tabbable — reachable via the
 * Tab key. An element can match `FOCUSABLE_SELECTOR` but still be
 * untabbable due to CSS visibility, ancestor state, or negative tabindex.
 */
function isTabbable(el: HTMLElement): boolean {
  // Only check tabIndex on elements with an explicit tabindex attribute.
  // Elements matched by the selector (button, input, a[href], etc.) are
  // natively focusable and should be tabbable regardless of what the
  // runtime reports for el.tabIndex — jsdom doesn't correctly return
  // tabIndex = 0 for contenteditable, audio[controls], and video[controls].
  if (el.hasAttribute('tabindex') && el.tabIndex < 0) {
    return false;
  }

  // Hidden inputs are never tabbable
  if (el instanceof HTMLInputElement && el.type === 'hidden') return false;

  // Disabled elements are never tabbable
  if ('disabled' in el && (el as HTMLButtonElement | HTMLInputElement).disabled) {
    return false;
  }

  // display: none on the element or any ancestor — not tabbable.
  // We walk up the tree because display:none on a parent hides all children.
  // NOTE: We use getComputedStyle instead of offsetParent because jsdom
  // does not implement offsetParent (it's always null in test environments).
  let ancestor: HTMLElement | null = el;
  while (ancestor) {
    if (getComputedStyle(ancestor).display === 'none') {
      return false;
    }
    ancestor = ancestor.parentElement;
  }

  // visibility: hidden on the element itself — not tabbable.
  // Only checked on the element, not ancestors, because a child can
  // override an ancestor's visibility:hidden with visibility:visible.
  if (getComputedStyle(el).visibility === 'hidden') {
    return false;
  }

  // Elements inside a closed <details> (except <summary>) are not tabbable
  const closedDetails = el.closest('details:not([open])');
  if (closedDetails) {
    const summary = closedDetails.querySelector('summary');
    if (el !== summary && !summary?.contains(el)) {
      return false;
    }
  }

  // Inert elements and their children are not tabbable
  if (el.closest('[inert]')) {
    return false;
  }

  return true;
}

/**
 * Returns all tabbable elements inside a container, in DOM order.
 *
 * Tabbable means the element can be reached via the Tab key. This
 * excludes elements with explicit `tabindex="-1"`, hidden elements,
 * disabled elements, elements inside closed `<details>`, and inert
 * elements.
 *
 * NOTE (v2): Does not handle positive tabindex ordering. Elements
 * with `tabindex="1"` etc. are included but sorted in DOM order,
 * not by tabindex value. See TODO comments for deferred items.
 *
 * @param container - The DOM element to search within.
 * @returns An array of tabbable HTMLElements in DOM order.
 */
export function getTabbableElements(container: HTMLElement): HTMLElement[] {
  const candidates = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  const tabbable: HTMLElement[] = [];

  for (const el of candidates) {
    if (isTabbable(el)) {
      tabbable.push(el);
    }
  }

  return tabbable;
}

// ---------------------------------------------------------------------------
// Focus trap hook
// ---------------------------------------------------------------------------

/**
 * TODO — Deferred edge cases (documented, not forgotten):
 *
 * Shadow DOM:
 *   `document.activeElement` returns the shadow host, not the focused
 *   element inside the shadow root. Correct detection requires walking
 *   `shadowRoot.activeElement` recursively. Deferred because none of
 *   flintwork's v1 primitives use Shadow DOM.
 *
 * iframe focus containment:
 *   When an iframe inside the trap receives focus, `document.activeElement`
 *   becomes the iframe element. The trap treats it as a single tabbable
 *   unit. It cannot control focus inside the iframe's document. Tabbing
 *   out of an iframe may escape the trap. No clean solution without
 *   cross-document cooperation.
 *
 * Positive tabindex ordering:
 *   Elements with `tabindex > 0` should be sorted before `tabindex="0"`
 *   elements. Current implementation uses DOM order for all elements.
 *   Rare in practice — almost no production code uses positive tabindex.
 *
 * Safari button focus:
 *   Safari on macOS doesn't focus <button> elements on click by default.
 *   `document.activeElement` stays on the previous element. Workaround:
 *   manually call `element.focus()` on mousedown inside the container.
 *   Deferred until Dialog testing on Safari surfaces the issue.
 *
 * Nested trap stack (v2):
 *   When a Dialog opens another Dialog, the inner trap should take over.
 *   On deactivation, the outer trap resumes. Requires a global trap stack
 *   instead of independent trap instances. Build when Dialog is end-to-end.
 *
 * Trigger fallback chain (v2):
 *   If the trigger element is removed from the DOM before deactivation,
 *   focus restoration fails. Fallback: closest focusable ancestor →
 *   next focusable sibling → document.body. Build alongside nested traps.
 */

interface UseFocusTrapOptions {
  /** Whether the trap is currently active. */
  enabled: boolean;
  /**
   * A specific element to focus when the trap activates.
   * If not provided, the hook looks for `[data-autofocus]`,
   * then falls back to the first tabbable element, then the container.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Traps keyboard focus inside a container element.
 *
 * When enabled, Tab and Shift+Tab cycle through tabbable elements inside
 * the container without escaping. Focus is placed on the initial target
 * when the trap activates and restored to the previously focused element
 * when it deactivates.
 *
 * @param containerRef - Ref to the DOM element that acts as the trap boundary.
 * @param options - Configuration: `enabled` to activate/deactivate, `initialFocusRef` to override initial focus.
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * useFocusTrap(containerRef, { enabled: isOpen });
 *
 * return <div ref={containerRef}>...</div>;
 * ```
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseFocusTrapOptions,
): void {
  const { enabled, initialFocusRef } = options;

  // Store the element that had focus before the trap activated
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // -----------------------------------------------------------------------
  // Tab/Shift+Tab key handler
  // -----------------------------------------------------------------------

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const tabbable = getTabbableElements(container);
      if (tabbable.length === 0) {
        // No tabbable elements — prevent Tab from escaping
        event.preventDefault();
        return;
      }

      const first = tabbable.at(0);
      const last = tabbable.at(-1);
      const active = document.activeElement as HTMLElement;

      if (!first || !last) return;

      if (event.shiftKey && (active === first || !container.contains(active))) {
        // Shift+Tab on first element → wrap to last
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        // Tab on last element → wrap to first
        event.preventDefault();
        first.focus();
      }
    },
    // `enabled` is not in the dependency array because this callback
    // is only attached to the document while the trap is active (inside
    // the useEffect). The structural guard is the listener lifecycle,
    // not a runtime check inside the callback.
    [containerRef],
  );

  // -----------------------------------------------------------------------
  // focusin guard — reclaim focus that escapes the trap
  // -----------------------------------------------------------------------

  const handleFocusIn = useCallback(
    (event: FocusEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const target = event.target as HTMLElement;

      // If focus landed outside the container, pull it back
      if (!container.contains(target)) {
        const tabbable = getTabbableElements(container);
        const first = tabbable.at(0);
        if (first) {
          first.focus();
        } else {
          container.focus();
        }
      }
    },
    [containerRef],
  );

  // -----------------------------------------------------------------------
  // Activation and deactivation
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    // Store currently focused element for restoration on deactivation
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Determine initial focus target
    // Priority: initialFocusRef → [data-autofocus] → first tabbable → container
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else {
      const autofocusTarget = container.querySelector<HTMLElement>('[data-autofocus]');
      if (autofocusTarget) {
        autofocusTarget.focus();
      } else {
        const tabbable = getTabbableElements(container);
        const firstTabbable = tabbable.at(0);
        if (firstTabbable) {
          firstTabbable.focus();
        } else {
          // No tabbable elements — focus the container itself.
          // Ensure it's programmatically focusable.
          if (!container.hasAttribute('tabindex')) {
            container.setAttribute('tabindex', '-1');
          }
          container.focus();
        }
      }
    }

    // Attach listeners. useEffect runs after DOM commit, so the
    // container and its children are guaranteed to be in the DOM.
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('focusin', handleFocusIn, true);

    // Cleanup — deactivate trap and restore focus
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('focusin', handleFocusIn, true);

      // Restore focus to the element that was focused before the trap
      const toRestore = previouslyFocusedRef.current;
      if (toRestore?.isConnected) {
        toRestore.focus();
      }
    };
  }, [enabled, containerRef, initialFocusRef, handleKeyDown, handleFocusIn]);
}