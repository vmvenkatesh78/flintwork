import { cloneElement, isValidElement, useCallback } from 'react';
import { usePopoverContext } from './popover-context';
import type { ReactElement, ReactNode } from 'react';

export interface PopoverCloseProps {
  children: ReactNode;
}

/**
 * Wraps any element that should close the popover. Renders its child
 * directly with no extra DOM wrapper.
 *
 * @example
 * ```tsx
 * <Popover.Close>
 *   <button>Done</button>
 * </Popover.Close>
 * ```
 */
export function PopoverClose({ children }: PopoverCloseProps) {
  const { onOpenChange } = usePopoverContext();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  if (!isValidElement<Record<string, unknown>>(children)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[flintwork] Popover.Close expects a single React element as its child.',
      );
    }
    return null;
  }

  return cloneElement(children as ReactElement<Record<string, unknown>>, {
    onClick: (event: React.MouseEvent) => {
      const childOnClick = (children.props as Record<string, unknown>).onClick;
      if (typeof childOnClick === 'function') {
        childOnClick(event);
      }
      handleClose();
    },
  });
}
