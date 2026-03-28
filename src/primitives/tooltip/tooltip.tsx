import { useId, useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { TooltipContext } from './tooltip-context';
import type { ReactNode } from 'react';

export interface TooltipProps {
  /**
   * Delay in ms before the tooltip appears on hover.
   * Prevents flicker on mouse pass-through. Defaults to `700`.
   */
  showDelay?: number;
  /**
   * Delay in ms before the tooltip disappears after mouse leaves.
   * Gives the user time to move to the tooltip content. Defaults to `300`.
   */
  hideDelay?: number;
  children: ReactNode;
}

/**
 * Root Tooltip component. Manages open state with configurable show/hide
 * delays. Renders no DOM element — pure context provider.
 *
 * The tooltip is non-interactive by design. It must not contain focusable
 * elements. If you need interactive content inside a popup, use Popover.
 *
 * Show behavior:
 * - Hover: shows after `showDelay` ms (default 700ms)
 * - Focus: shows immediately (keyboard users shouldn't wait)
 * - Escape: hides immediately without moving focus
 *
 * Hide behavior:
 * - Mouse leave trigger: hides after `hideDelay` ms (default 300ms)
 * - Mouse enter tooltip content: cancels hide (allows reading long tooltips)
 * - Mouse leave tooltip content: restarts hide delay
 * - Blur: hides immediately
 * - Escape: hides immediately
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <Tooltip.Trigger>
 *     <button>Save</button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Portal>
 *     <Tooltip.Content>Save your changes</Tooltip.Content>
 *   </Tooltip.Portal>
 * </Tooltip>
 *
 * // Custom delays
 * <Tooltip showDelay={400} hideDelay={100}>
 *   ...
 * </Tooltip>
 * ```
 */
export function TooltipRoot({
  showDelay = 700,
  hideDelay = 300,
  children,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending timers
  const clearTimers = useCallback(() => {
    if (showTimerRef.current !== null) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  // Show with delay (hover)
  const show = useCallback(() => {
    clearTimers();
    showTimerRef.current = setTimeout(() => {
      setOpen(true);
      showTimerRef.current = null;
    }, showDelay);
  }, [clearTimers, showDelay]);

  // Hide with delay (mouse leave)
  const hide = useCallback(() => {
    clearTimers();
    hideTimerRef.current = setTimeout(() => {
      setOpen(false);
      hideTimerRef.current = null;
    }, hideDelay);
  }, [clearTimers, hideDelay]);

  // Show immediately (focus)
  const showImmediate = useCallback(() => {
    clearTimers();
    setOpen(true);
  }, [clearTimers]);

  // Hide immediately (blur, escape)
  const hideImmediate = useCallback(() => {
    clearTimers();
    setOpen(false);
  }, [clearTimers]);

  // Escape key — hides tooltip without moving focus.
  // Attached at the root level so it works regardless of which
  // element has focus. Only active when tooltip is open.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideImmediate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, hideImmediate]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const context = useMemo(
    () => ({
      open,
      show,
      hide,
      showImmediate,
      hideImmediate,
      tooltipId,
    }),
    [open, show, hide, showImmediate, hideImmediate, tooltipId],
  );

  return (
    <TooltipContext.Provider value={context}>
      {children}
    </TooltipContext.Provider>
  );
}
