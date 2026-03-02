import { useId, useRef, useMemo } from 'react';
import { useControllable } from '../../hooks/use-controllable';
import { DialogContext } from './dialog-context';
import type { ReactNode } from 'react';

export interface DialogProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called when the dialog wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/**
 * Root Dialog component. Provides shared state to all compound children.
 * Renders no DOM element — this is a pure context provider.
 *
 * Supports both controlled and uncontrolled usage via `useControllable`.
 *
 * @example
 * ```tsx
 * // Controlled
 * const [open, setOpen] = useState(false);
 * <Dialog open={open} onOpenChange={setOpen}>...</Dialog>
 *
 * // Uncontrolled
 * <Dialog defaultOpen={false}>...</Dialog>
 * ```
 */
export function DialogRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange: onOpenChangeProp,
  children,
}: DialogProps) {
  const [open, setOpen] = useControllable<boolean>(
    openProp,
    defaultOpen,
    onOpenChangeProp,
  );

  const contentId = useId();
  const titleId = useId();
  const descriptionId = useId();

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  const context = useMemo(
    () => ({
      open,
      onOpenChange: setOpen,
      contentId,
      titleId,
      descriptionId,
      triggerRef,
      contentRef,
    }),
    [open, setOpen, contentId, titleId, descriptionId],
  );

  return (
    <DialogContext.Provider value={context}>
      {children}
    </DialogContext.Provider>
  );
}
