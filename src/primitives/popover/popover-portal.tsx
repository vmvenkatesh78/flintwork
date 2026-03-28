import { createPortal } from 'react-dom';
import { usePopoverContext } from './popover-context';
import type { ReactNode } from 'react';

export interface PopoverPortalProps {
  /** The DOM element to portal into. Defaults to `document.body`. */
  container?: HTMLElement;
  children: ReactNode;
}

/**
 * Renders children into a portal. Only renders when the popover is open.
 * Breaks out of parent overflow and stacking contexts.
 *
 * @example
 * ```tsx
 * <Popover.Portal>
 *   <Popover.Content>...</Popover.Content>
 * </Popover.Portal>
 * ```
 */
export function PopoverPortal({ container, children }: PopoverPortalProps) {
  const { open } = usePopoverContext();

  if (!open) return null;

  return createPortal(children, container ?? document.body);
}
