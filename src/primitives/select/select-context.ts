import { createContext, useContext } from 'react';

export interface SelectContextValue {
  /** Whether the listbox is currently open. */
  open: boolean;
  /** Toggle the listbox. */
  onOpenChange: (open: boolean) => void;
  /** The currently selected value. */
  selectedValue: string;
  /** Update the selected value. */
  onValueChange: (value: string) => void;
  /** Id for the listbox content. Trigger uses this for aria-controls. */
  contentId: string;
  /** Ref to the trigger for focus restoration. */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Ref to the content for focus trap and click-outside. */
  contentRef: React.RefObject<HTMLElement | null>;
  /**
   * Registry of value → display text. Items register themselves on mount
   * so Select.Value can display the selected item's text without
   * requiring the consumer to pass it separately.
   */
  itemTextMap: React.MutableRefObject<Map<string, string>>;
}

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext(): SelectContextValue {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error(
      '[flintwork] Select compound components must be used within a <Select> root.',
    );
  }
  return context;
}
