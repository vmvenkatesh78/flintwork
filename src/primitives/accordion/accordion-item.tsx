import { useId, useMemo, type ComponentPropsWithoutRef } from 'react';
import { useAccordionContext, AccordionItemContext } from './accordion-context';

export interface AccordionItemProps extends ComponentPropsWithoutRef<'div'> {
  /** Unique value identifying this item. Links trigger to content. */
  value: string;
}

/**
 * Wraps a single accordion section (trigger + content pair).
 * Renders a `<div>` and provides item-scoped context.
 *
 * Each item generates deterministic IDs for its trigger and content
 * so they can reference each other via `aria-controls` and
 * `aria-labelledby` without a registration mechanism.
 *
 * @example
 * ```tsx
 * <Accordion.Item value="section-1">
 *   <Accordion.Trigger>Section title</Accordion.Trigger>
 *   <Accordion.Content>Section content</Accordion.Content>
 * </Accordion.Item>
 * ```
 */
export function AccordionItem({ value, children, ...rest }: AccordionItemProps) {
  const { openValues } = useAccordionContext();
  const isOpen = openValues.includes(value);

  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  const context = useMemo(
    () => ({ value, isOpen, triggerId, contentId }),
    [value, isOpen, triggerId, contentId],
  );

  return (
    <AccordionItemContext.Provider value={context}>
      <div data-state={isOpen ? 'open' : 'closed'} {...rest}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}
