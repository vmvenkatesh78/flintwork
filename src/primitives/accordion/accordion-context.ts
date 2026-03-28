import { createContext, useContext } from 'react';

// ---------------------------------------------------------------------------
// Root context — shared across all items
// ---------------------------------------------------------------------------

export interface AccordionContextValue {
  /** Which items are currently open. */
  openValues: string[];
  /** Toggle an item open/closed. */
  toggle: (value: string) => void;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      '[flintwork] Accordion compound components must be used within an <Accordion> root.',
    );
  }
  return context;
}

// ---------------------------------------------------------------------------
// Item context — scoped to a single accordion item
// ---------------------------------------------------------------------------

export interface AccordionItemContextValue {
  /** The value identifying this item. */
  value: string;
  /** Whether this item's content is visible. */
  isOpen: boolean;
  /** Id for the trigger button. Content uses this for aria-labelledby. */
  triggerId: string;
  /** Id for the content panel. Trigger uses this for aria-controls. */
  contentId: string;
}

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export function useAccordionItemContext(): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      '[flintwork] Accordion.Trigger and Accordion.Content must be used within an <Accordion.Item>.',
    );
  }
  return context;
}
