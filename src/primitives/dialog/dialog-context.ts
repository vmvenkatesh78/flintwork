import { createContext, useContext } from 'react';

export interface DialogContextValue {
  /** Whether the dialog is currently open. */
  open: boolean;
  /** Toggle the dialog open/closed. */
  onOpenChange: (open: boolean) => void;
  /** Id for the Content element. Trigger uses this for aria-controls. */
  contentId: string;
  /** Id for the Title element. Content uses this for aria-labelledby. */
  titleId: string;
  /** Id for the Description element. Content uses this for aria-describedby. */
  descriptionId: string;
  /** Ref to the trigger element for focus restoration on close. */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Ref to the content panel for focus trap and click-outside. */
  contentRef: React.RefObject<HTMLElement | null>;
}

export const DialogContext = createContext<DialogContextValue | null>(null);

/**
 * Returns the Dialog context. Throws if used outside a Dialog root.
 */
export function useDialogContext(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      '[flintwork] Dialog compound components must be used within a <Dialog> root.',
    );
  }
  return context;
}
