import { useDialogContext } from './dialog-context';
import type { ComponentPropsWithoutRef } from 'react';

export interface DialogDescriptionProps extends ComponentPropsWithoutRef<'p'> {}

/**
 * Optional supplementary description for the dialog. Renders a `<p>`
 * whose `id` is linked to `Dialog.Content`'s `aria-describedby`.
 *
 * Provides additional context for screen readers beyond the title.
 * If omitted, the dialog has a title but no description — which is fine.
 *
 * @example
 * ```tsx
 * <Dialog.Description>
 *   This action cannot be undone. Your data will be permanently deleted.
 * </Dialog.Description>
 * ```
 */
export function DialogDescription({ children, ...rest }: DialogDescriptionProps) {
  const { descriptionId } = useDialogContext();

  return (
    <p id={descriptionId} {...rest}>
      {children}
    </p>
  );
}
