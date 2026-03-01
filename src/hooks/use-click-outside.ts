import { useEffect, useCallback, useRef } from 'react';

/**
 * Calls a handler when a click or touch occurs outside the specified
 * container element.
 *
 * This is one half of Dialog's dismissal behavior (the other half is
 * Escape key handling, which lives in the Dialog component itself).
 *
 * Implementation notes:
 *
 * - Uses `mousedown` instead of `click`. A `click` fires after `mouseup`,
 *   which means if a user presses inside the Dialog, drags outside, and
 *   releases, it would incorrectly dismiss. `mousedown` captures the
 *   intent at the moment of press.
 *
 * - Uses `touchstart` for mobile. Same reasoning as `mousedown` — capture
 *   the intent early.
 *
 * - The handler is stored in a ref so the effect doesn't re-attach
 *   listeners when the handler changes. This avoids stale closure issues
 *   without requiring the consumer to memoize their callback.
 *
 * - Listeners are attached on the capture phase to intercept events before
 *   they reach other handlers that might call `stopPropagation()`.
 *
 * @param containerRef - Ref to the element that defines "inside."
 * @param handler - Called when a click/touch lands outside the container.
 * @param enabled - Whether the listener is active. Defaults to `true`.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setOpen(false), isOpen);
 *
 * return <div ref={ref}>Dialog content</div>;
 * ```
 */
export function useClickOutside(
  containerRef: React.RefObject<HTMLElement | null>,
  handler: () => void,
  enabled: boolean = true,
): void {
  // Store handler in a ref so the effect doesn't depend on it.
  // This means consumers don't need to memoize their callback.
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const handleEvent = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const target = event.target as Node;

      // Click was inside the container — do nothing
      if (container.contains(target)) return;

      // Click was outside — call the handler
      handlerRef.current();
    },
    [containerRef],
  );

  useEffect(() => {
    if (!enabled) return;

    // Use capture phase to intercept before stopPropagation in children.
    // Use mousedown/touchstart instead of click to detect intent at press,
    // not release — prevents dismiss on drag-out-and-release.
    document.addEventListener('mousedown', handleEvent, true);
    document.addEventListener('touchstart', handleEvent, true);

    return () => {
      document.removeEventListener('mousedown', handleEvent, true);
      document.removeEventListener('touchstart', handleEvent, true);
    };
  }, [enabled, handleEvent]);
}