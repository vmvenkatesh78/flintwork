import { cloneElement, isValidElement, useCallback } from 'react';
import { useTooltipContext } from './tooltip-context';
import type { ReactElement, ReactNode } from 'react';

export interface TooltipTriggerProps {
  children: ReactNode;
}

/**
 * Wraps the element that shows the tooltip on hover and focus.
 * Renders its child directly with no extra DOM wrapper.
 *
 * Attaches:
 * - `onMouseEnter` — starts show delay (700ms default)
 * - `onMouseLeave` — starts hide delay (300ms default)
 * - `onFocus` — shows immediately (keyboard users shouldn't wait)
 * - `onBlur` — hides immediately
 * - `aria-describedby` — points to tooltip content (only when open)
 *
 * Why `aria-describedby` and not `aria-labelledby`: The tooltip provides
 * supplementary description, not the accessible name. The trigger already
 * has its own label (button text, aria-label, etc.). The tooltip adds
 * context. If the tooltip IS the only label for the element, the consumer
 * should use `aria-labelledby` directly — but that's an uncommon pattern
 * and not the default.
 *
 * Why `aria-describedby` is always set (not conditional on open): Screen
 * readers cache the description relationship. If `aria-describedby` only
 * appears when open, some screen readers won't pick it up because they
 * read the attribute when the element first receives focus, not when the
 * tooltip appears. Setting it unconditionally means the tooltip content
 * must always be in the DOM (but can be visually hidden). However, since
 * we use Portal and conditional rendering, we set it conditionally to
 * avoid referencing a non-existent ID. This is the same tradeoff Dialog
 * makes with `aria-controls`.
 *
 * @example
 * ```tsx
 * <Tooltip.Trigger>
 *   <button aria-label="Delete">🗑</button>
 * </Tooltip.Trigger>
 *
 * <Tooltip.Trigger>
 *   <IconButton>...</IconButton>
 * </Tooltip.Trigger>
 * ```
 */
export function TooltipTrigger({ children }: TooltipTriggerProps) {
  const { open, show, hide, showImmediate, hideImmediate, tooltipId } =
    useTooltipContext();

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent) => {
      const childOnMouseEnter = (
        (children as ReactElement)?.props as Record<string, unknown>
      )?.onMouseEnter;
      if (typeof childOnMouseEnter === 'function') {
        childOnMouseEnter(event);
      }
      show();
    },
    [children, show],
  );

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent) => {
      const childOnMouseLeave = (
        (children as ReactElement)?.props as Record<string, unknown>
      )?.onMouseLeave;
      if (typeof childOnMouseLeave === 'function') {
        childOnMouseLeave(event);
      }
      hide();
    },
    [children, hide],
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent) => {
      const childOnFocus = (
        (children as ReactElement)?.props as Record<string, unknown>
      )?.onFocus;
      if (typeof childOnFocus === 'function') {
        childOnFocus(event);
      }
      showImmediate();
    },
    [children, showImmediate],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent) => {
      const childOnBlur = (
        (children as ReactElement)?.props as Record<string, unknown>
      )?.onBlur;
      if (typeof childOnBlur === 'function') {
        childOnBlur(event);
      }
      hideImmediate();
    },
    [children, hideImmediate],
  );

  if (!isValidElement<Record<string, unknown>>(children)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[flintwork] Tooltip.Trigger expects a single React element as its child.',
      );
    }
    return null;
  }

  return cloneElement(children as ReactElement<Record<string, unknown>>, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...(open ? { 'aria-describedby': tooltipId } : {}),
  });
}
