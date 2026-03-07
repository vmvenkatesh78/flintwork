import { useEffect, useCallback, type ComponentPropsWithoutRef } from 'react';
import { useDialogContext } from './dialog-context';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { useClickOutside } from '../../hooks/use-click-outside';

export interface DialogContentProps extends ComponentPropsWithoutRef<'div'> {}

/**
 * The modal dialog panel. Renders a `<div>` with `role="dialog"` and
 * `aria-modal="true"`.
 *
 * This is where the three hooks converge:
 * - `useFocusTrap` — traps Tab/Shift+Tab inside the panel, restores focus
 *   to the trigger on close.
 * - `useClickOutside` — closes the dialog when clicking outside the panel.
 * - Escape key handler — closes the dialog on Escape.
 *
 * Only renders when the dialog is open (Dialog.Portal handles conditional
 * rendering). Because of this, `useFocusTrap` is always enabled — the
 * component only exists in the DOM while the dialog is open.
 */
export function DialogContent({
  children,
  ...rest
}: DialogContentProps) {
  const {
    onOpenChange,
    contentId,
    titleId,
    descriptionId,
    contentRef,
  } = useDialogContext();

  // -----------------------------------------------------------------------
  // Focus trap — traps Tab/Shift+Tab inside the panel.
  // Always enabled because Content only mounts when the dialog is open.
  // On unmount (dialog closes), the hook's cleanup restores focus to the
  // element that was focused before the trap activated (the trigger).
  // -----------------------------------------------------------------------
  useFocusTrap(contentRef, { enabled: true });

  // -----------------------------------------------------------------------
  // Click outside — closes the dialog when clicking outside the panel.
  // -----------------------------------------------------------------------
  const handleClickOutside = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useClickOutside(contentRef, handleClickOutside);

  // -----------------------------------------------------------------------
  // Escape key — closes the dialog.
  // A modal dialog that doesn't close on Escape violates WAI-ARIA.
  // There's no prop to disable this — if a consumer needs to prevent
  // dismissal, they handle it in their onOpenChange callback.
  // -----------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpenChange]);

  return (
    <div
      ref={(node: HTMLDivElement | null) => {
        (contentRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      id={contentId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      {...rest}
    >
      {children}
    </div>
  );
}
