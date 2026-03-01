import { useCallback, useEffect, useRef } from 'react';
import { getTabbableElements } from './use-focus-trap';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Orientation = 'horizontal' | 'vertical' | 'both';

interface UseRovingTabIndexOptions {
  /** Arrow key direction. 'horizontal' = Left/Right, 'vertical' = Up/Down, 'both' = all four. */
  orientation: Orientation;
  /** Whether arrow navigation wraps around at the ends. */
  loop: boolean;
  /** Called when the active (tabindex="0") item changes. Receives the new index. */
  onActiveChange?: (index: number) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns all roving-eligible children inside the container.
 * These are direct tabbable descendants that are not disabled.
 * Elements with `data-disabled` or `aria-disabled="true"` are skipped.
 */
function getRovingItems(container: HTMLElement): HTMLElement[] {
  const tabbable = getTabbableElements(container);

  // Also include items with tabindex="-1" that are part of the roving set.
  // The roving pattern sets all non-active items to tabindex="-1", which
  // getTabbableElements excludes. So we query all items with a role or
  // explicit data-roving attribute, then filter out disabled ones.

  // NOTE: The [tabindex] selector is intentionally broad for v1. This
  // assumes the container is a tight widget (tablist, toolbar, menu)
  // with only roving items as direct interactive children. If this hook
  // is used on a larger container with nested interactive elements,
  // the selector should be narrowed to avoid sweeping up non-roving
  // items. For now, role-based selectors cover the common cases and
  // data-roving-item handles the rest.
  const allCandidates = container.querySelectorAll<HTMLElement>(
    '[role="tab"], [role="menuitem"], [role="option"], [data-roving-item], [tabindex]',
  );

  const items: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();

  // Merge tabbable elements and roving candidates, preserving DOM order
  for (const el of allCandidates) {
    if (seen.has(el)) continue;
    if (isDisabled(el)) continue;
    seen.add(el);
    items.push(el);
  }

  return items;
}

/**
 * Checks if an element is disabled via `data-disabled`, `aria-disabled`,
 * or the native `disabled` attribute.
 */
function isDisabled(el: HTMLElement): boolean {
  if (el.hasAttribute('data-disabled')) return true;
  if (el.getAttribute('aria-disabled') === 'true') return true;
  if ('disabled' in el && (el as HTMLButtonElement).disabled) return true;
  return false;
}

/**
 * Maps a keyboard event key to a navigation direction based on orientation.
 * Returns the delta (-1 for previous, +1 for next) or null if the key
 * doesn't apply to the current orientation.
 */
function getDirectionFromKey(
  key: string,
  orientation: Orientation,
): -1 | 1 | 'home' | 'end' | null {
  if (key === 'Home') return 'home';
  if (key === 'End') return 'end';

  const horizontal = orientation === 'horizontal' || orientation === 'both';
  const vertical = orientation === 'vertical' || orientation === 'both';

  if (key === 'ArrowRight' && horizontal) return 1;
  if (key === 'ArrowLeft' && horizontal) return -1;
  if (key === 'ArrowDown' && vertical) return 1;
  if (key === 'ArrowUp' && vertical) return -1;

  return null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Manages roving tabindex navigation for composite widgets.
 *
 * Only one item in the container has `tabindex="0"` at a time — the active
 * item. All others have `tabindex="-1"`. Arrow keys move the active item.
 * Tab exits the widget entirely. When focus re-enters the widget, it lands
 * on the last active item automatically (the browser handles this because
 * only one element has `tabindex="0"`).
 *
 * Works with Tabs, toolbars, menus, listboxes, or any widget that needs
 * arrow key navigation between items.
 *
 * Items are identified by role (`tab`, `menuitem`, `option`) or by the
 * `data-roving-item` attribute. Disabled items (`data-disabled`,
 * `aria-disabled="true"`, or native `disabled`) are skipped during
 * navigation.
 *
 * @param containerRef - Ref to the container element (tablist, toolbar, menu).
 * @param options - Navigation configuration.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useRovingTabIndex(ref, { orientation: 'horizontal', loop: true });
 *
 * return (
 *   <div ref={ref} role="tablist">
 *     <button role="tab" tabIndex={0}>Tab 1</button>
 *     <button role="tab" tabIndex={-1}>Tab 2</button>
 *     <button role="tab" tabIndex={-1}>Tab 3</button>
 *   </div>
 * );
 * ```
 */
export function useRovingTabIndex(
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseRovingTabIndexOptions,
): void {
  const { orientation, loop, onActiveChange } = options;
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const direction = getDirectionFromKey(event.key, orientation);
      if (direction === null) return;

      const items = getRovingItems(container);
      if (items.length === 0) return;

      // Prevent default scrolling behavior for arrow keys
      event.preventDefault();

      const currentIndex = items.findIndex(
        (item) => item === document.activeElement,
      );

      let nextIndex: number;

      if (direction === 'home') {
        nextIndex = 0;
      } else if (direction === 'end') {
        nextIndex = items.length - 1;
      } else {
        // direction is -1 or 1
        nextIndex = currentIndex + direction;

        if (loop) {
          // Wrap around
          if (nextIndex < 0) nextIndex = items.length - 1;
          if (nextIndex >= items.length) nextIndex = 0;
        } else {
          // Clamp to bounds
          if (nextIndex < 0 || nextIndex >= items.length) return;
        }
      }

      const nextItem = items.at(nextIndex);
      if (!nextItem) return;

      // Update tabindex: remove from all, set on next
      for (const item of items) {
        item.setAttribute('tabindex', '-1');
      }
      nextItem.setAttribute('tabindex', '0');
      nextItem.focus();

      onActiveChangeRef.current?.(nextIndex);
    },
    [containerRef, orientation, loop],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Ensure exactly one item has tabindex="0" on mount.
    // If none do, set it on the first non-disabled item.
    const items = getRovingItems(container);
    const hasActive = items.some((item) => item.getAttribute('tabindex') === '0');

    if (!hasActive && items.length > 0) {
      const first = items.at(0);
      if (first) {
        for (const item of items) {
          item.setAttribute('tabindex', '-1');
        }
        first.setAttribute('tabindex', '0');
      }
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, handleKeyDown]);
}