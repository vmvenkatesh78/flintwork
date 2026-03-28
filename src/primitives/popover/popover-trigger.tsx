import { cloneElement, isValidElement, useCallback } from 'react';
import { usePopoverContext } from './popover-context';
import type { ReactElement, ReactNode } from 'react';

export interface PopoverTriggerProps {
  children: ReactNode;
}

/**
 * Wraps the element that toggles the popover. Renders its child
 * directly with no extra DOM wrapper.
 *
 * Attaches:
 * - `onClick` — toggles the popover open/closed
 * - `aria-haspopup="dialog"` — announces a popup to screen readers
 * - `aria-expanded` — reflects open state
 * - `aria-controls` — points to content panel (only when open)
 * - `ref` — stored for focus restoration on close
 *
 * Unlike Dialog.Trigger which only opens, Popover.Trigger toggles.
 * Clicking an open popover's trigger closes it. This matches the
 * expected behavior for dropdown menus, settings panels, and filters.
 *
 * @example
 * ```tsx
 * <Popover.Trigger>
 *   <button>Filter</button>
 * </Popover.Trigger>
 * ```
 */
export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { open, onOpenChange, contentId, triggerRef } = usePopoverContext();

  const handleClick = useCallback(() => {
    onOpenChange(!open);
  }, [open, onOpenChange]);

  if (!isValidElement<Record<string, unknown>>(children)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[flintwork] Popover.Trigger expects a single React element as its child.',
      );
    }
    return null;
  }

  return cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;

      const childRef = (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef && typeof childRef === 'object') {
        (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onClick: (event: React.MouseEvent) => {
      const childOnClick = (children.props as Record<string, unknown>).onClick;
      if (typeof childOnClick === 'function') {
        childOnClick(event);
      }
      handleClick();
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    ...(open ? { 'aria-controls': contentId } : {}),
  });
}
