import { createPortal } from 'react-dom';
import { useDialogContext } from './dialog-context';
import type { ReactNode } from 'react';

export interface DialogPortalProps {
  /** The DOM element to portal into. Defaults to `document.body`. */
  container?: HTMLElement;
  children: ReactNode;
}

/**
 * Renders children into a portal at the end of a container element.
 * Only renders when the dialog is open.
 *
 * This breaks out of parent overflow, z-index, and stacking contexts.
 *
 * @example
 * ```tsx
 * <Dialog.Portal>
 *   <Dialog.Overlay />
 *   <Dialog.Content>...</Dialog.Content>
 * </Dialog.Portal>
 * ```
 */
export function DialogPortal({ container, children }: DialogPortalProps) {
  const { open } = useDialogContext();

  if (!open) return null;

  return createPortal(children, container ?? document.body);
}
