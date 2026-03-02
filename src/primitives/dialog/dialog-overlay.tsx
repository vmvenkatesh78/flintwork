import type { ComponentPropsWithoutRef } from 'react';

export interface DialogOverlayProps extends ComponentPropsWithoutRef<'div'> {}

/**
 * The backdrop behind the dialog panel. Renders a `<div>` with
 * `aria-hidden="true"` because it's purely decorative.
 *
 * This component does NOT handle click-to-dismiss — that responsibility
 * belongs to `useClickOutside` on `Dialog.Content`. Clicking the overlay
 * triggers dismissal because the overlay is outside the content panel.
 *
 * Styling is the consumer's responsibility: semi-transparent background,
 * blur, fixed positioning, etc. This component provides no default styles.
 *
 * @example
 * ```tsx
 * <Dialog.Overlay className="dialog-overlay" />
 * ```
 */
export function DialogOverlay({ ...rest }: DialogOverlayProps) {
  return (
    <div
      aria-hidden="true"
      data-dialog-overlay=""
      {...rest}
    />
  );
}
