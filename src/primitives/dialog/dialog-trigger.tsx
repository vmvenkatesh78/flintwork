import { cloneElement, isValidElement, useCallback } from 'react';
import { useDialogContext } from './dialog-context';
import type { ReactElement, ReactNode } from 'react';

export interface DialogTriggerProps {
  children: ReactNode;
}

/**
 * Wraps the element that opens the dialog. Renders its child directly
 * with no extra DOM wrapper. Attaches onClick, aria-haspopup, aria-expanded,
 * and aria-controls to the child.
 *
 * Also stores a ref to the trigger element. When the dialog closes,
 * `useFocusTrap` restores focus to whatever had focus before the trap
 * activated — which should be the trigger, since clicking it is what
 * opened the dialog.
 *
 * @example
 * ```tsx
 * <Dialog.Trigger>
 *   <button>Open settings</button>
 * </Dialog.Trigger>
 * ```
 */
export function DialogTrigger({ children }: DialogTriggerProps) {
  const { open, onOpenChange, contentId, triggerRef } = useDialogContext();

  const handleClick = useCallback(() => {
    onOpenChange(true);
  }, [onOpenChange]);

  if (!isValidElement<Record<string, unknown>>(children)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[flintwork] Dialog.Trigger expects a single React element as its child.',
      );
    }
    return null;
  }

  return cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;

      // Preserve the child's existing ref
      const childRef = (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef && typeof childRef === 'object') {
        (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onClick: (event: React.MouseEvent) => {
      // Call the child's existing onClick before opening
      const childOnClick = (children.props as Record<string, unknown>).onClick;
      if (typeof childOnClick === 'function') {
        childOnClick(event);
      }
      handleClick();
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    // Only point aria-controls at content when it exists in the DOM
    ...(open ? { 'aria-controls': contentId } : {}),
  });
}
