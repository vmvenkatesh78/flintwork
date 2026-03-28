import { createContext, useContext } from 'react';

export interface PopoverContextValue {
  /** Whether the popover is currently open. */
  open: boolean;
  /** Toggle the popover. */
  onOpenChange: (open: boolean) => void;
  /** Id for the content panel. Trigger uses this for aria-controls. */
  contentId: string;
  /** Ref to the trigger element for focus restoration. */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Ref to the content panel for focus trap and click-outside. */
  contentRef: React.RefObject<HTMLElement | null>;
}

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export function usePopoverContext(): PopoverContextValue {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error(
      '[flintwork] Popover compound components must be used within a <Popover> root.',
    );
  }
  return context;
}
