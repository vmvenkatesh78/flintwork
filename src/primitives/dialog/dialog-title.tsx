import { useDialogContext } from './dialog-context';
import type { ComponentPropsWithoutRef } from 'react';

export interface DialogTitleProps extends ComponentPropsWithoutRef<'h2'> {}

/**
 * The dialog's accessible title. Renders an `<h2>` whose `id` is
 * linked to `Dialog.Content`'s `aria-labelledby`.
 *
 * Required for accessibility — a dialog without a title is announced
 * as "dialog" with no context. Can be visually hidden with `sr-only`
 * if needed.
 *
 * @example
 * ```tsx
 * <Dialog.Title>Confirm deletion</Dialog.Title>
 * <Dialog.Title className="sr-only">Settings panel</Dialog.Title>
 * ```
 */
export function DialogTitle({ children, ...rest }: DialogTitleProps) {
  const { titleId } = useDialogContext();

  return (
    <h2 id={titleId} {...rest}>
      {children}
    </h2>
  );
}
