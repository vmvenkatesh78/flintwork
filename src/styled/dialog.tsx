import type { ComponentPropsWithoutRef } from 'react';
import { Dialog as DialogPrimitive } from '../primitives/dialog';
import type { DialogProps } from '../primitives/dialog';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DialogContentSize = 'sm' | 'md' | 'lg';

interface StyledDialogOverlayProps extends ComponentPropsWithoutRef<'div'> {}

interface StyledDialogContentProps extends ComponentPropsWithoutRef<'div'> {
  /** Dialog width. Controls max-width via token. Defaults to `'md'`. */
  size?: DialogContentSize;
}

interface StyledDialogTitleProps extends ComponentPropsWithoutRef<'h2'> {}

interface StyledDialogDescriptionProps extends ComponentPropsWithoutRef<'p'> {}

// ---------------------------------------------------------------------------
// Sub-components — only wrap the ones that produce styled DOM
// ---------------------------------------------------------------------------

function StyledOverlay(props: Readonly<StyledDialogOverlayProps>) {
  return <DialogPrimitive.Overlay data-fw-dialog-overlay="" {...props} />;
}
StyledOverlay.displayName = 'Dialog.Overlay';

function StyledContent({ size = 'md', ...rest }: Readonly<StyledDialogContentProps>) {
  return (
    <DialogPrimitive.Content
      data-fw-dialog-content=""
      data-size={size}
      {...rest}
    />
  );
}
StyledContent.displayName = 'Dialog.Content';

function StyledTitle(props: Readonly<StyledDialogTitleProps>) {
  return <DialogPrimitive.Title data-fw-dialog-title="" {...props} />;
}
StyledTitle.displayName = 'Dialog.Title';

function StyledDescription(props: Readonly<StyledDialogDescriptionProps>) {
  return (
    <DialogPrimitive.Description data-fw-dialog-description="" {...props} />
  );
}
StyledDescription.displayName = 'Dialog.Description';

// ---------------------------------------------------------------------------
// Root wrapper — prevents Object.assign from mutating the primitive
// ---------------------------------------------------------------------------

function StyledDialogRoot(props: Readonly<DialogProps>) {
  return <DialogPrimitive {...props} />;
}
StyledDialogRoot.displayName = 'Dialog';

// ---------------------------------------------------------------------------
// Compound component assembly
// ---------------------------------------------------------------------------

/**
 * Styled Dialog.
 *
 * Wraps the headless Dialog primitive with token-driven CSS. Only the
 * sub-components that produce visible DOM get a styled wrapper — Root,
 * Trigger, Portal, and Close pass through unchanged.
 *
 * Uses a fresh root function instead of Object.assign on the primitive
 * directly — this prevents mutation of the primitive's sub-component
 * references, which would break consumers importing from
 * `flintwork/primitives`.
 *
 * Requires `flintwork/styles/dialog.css` (or `flintwork/styles`) to be
 * imported for styles to apply.
 *
 * @example
 * ```tsx
 * import { Dialog } from 'flintwork';
 * import 'flintwork/styles/dialog.css';
 *
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <Dialog.Trigger>
 *     <button>Open</button>
 *   </Dialog.Trigger>
 *   <Dialog.Portal>
 *     <Dialog.Overlay />
 *     <Dialog.Content size="md">
 *       <Dialog.Title>Settings</Dialog.Title>
 *       <Dialog.Description>Update your preferences.</Dialog.Description>
 *       <Dialog.Close>
 *         <button>Done</button>
 *       </Dialog.Close>
 *     </Dialog.Content>
 *   </Dialog.Portal>
 * </Dialog>
 * ```
 */
export const Dialog = Object.assign(StyledDialogRoot, {
  Trigger: DialogPrimitive.Trigger,
  Portal: DialogPrimitive.Portal,
  Overlay: StyledOverlay,
  Content: StyledContent,
  Title: StyledTitle,
  Description: StyledDescription,
  Close: DialogPrimitive.Close,
});

export type { DialogProps } from '../primitives/dialog';
export type { DialogTriggerProps, DialogPortalProps, DialogCloseProps } from '../primitives/dialog';
export type {
  StyledDialogOverlayProps as DialogOverlayProps,
  StyledDialogContentProps as DialogContentProps,
  StyledDialogTitleProps as DialogTitleProps,
  StyledDialogDescriptionProps as DialogDescriptionProps,
};