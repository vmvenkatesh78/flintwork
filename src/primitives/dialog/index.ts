import { DialogRoot } from './dialog';
import { DialogTrigger } from './dialog-trigger';
import { DialogPortal } from './dialog-portal';
import { DialogOverlay } from './dialog-overlay';
import { DialogContent } from './dialog-content';
import { DialogTitle } from './dialog-title';
import { DialogDescription } from './dialog-description';
import { DialogClose } from './dialog-close';

/**
 * Modal dialog compound component.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <Dialog.Trigger>
 *     <button>Open</button>
 *   </Dialog.Trigger>
 *
 *   <Dialog.Portal>
 *     <Dialog.Overlay />
 *     <Dialog.Content>
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
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});

export type { DialogProps } from './dialog';
export type { DialogTriggerProps } from './dialog-trigger';
export type { DialogPortalProps } from './dialog-portal';
export type { DialogOverlayProps } from './dialog-overlay';
export type { DialogContentProps } from './dialog-content';
export type { DialogTitleProps } from './dialog-title';
export type { DialogDescriptionProps } from './dialog-description';
export type { DialogCloseProps } from './dialog-close';
