import { cloneElement, isValidElement, useCallback } from 'react';
import { useDialogContext } from './dialog-context';
import type { ReactElement, ReactNode } from 'react';

export interface DialogCloseProps {
  children: ReactNode;
}

/**
 * Wraps any element that should close the dialog. Renders its child
 * directly with no extra DOM wrapper. Attaches onClick to set open to false.
 *
 * @example
 * ```tsx
 * <Dialog.Close>
 *   <button>Cancel</button>
 * </Dialog.Close>
 *
 * <Dialog.Close>
 *   <IconButton aria-label="Close">×</IconButton>
 * </Dialog.Close>
 * ```
 */
export function DialogClose({ children }: DialogCloseProps) {
  const { onOpenChange } = useDialogContext();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  if (!isValidElement<Record<string, unknown>>(children)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[flintwork] Dialog.Close expects a single React element as its child.',
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
