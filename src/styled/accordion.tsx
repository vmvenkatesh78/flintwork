import { Accordion as AccordionPrimitive } from '../primitives/accordion';
import type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from '../primitives/accordion';

// ---------------------------------------------------------------------------
// Sub-components — only wrap the ones that produce styled DOM
// ---------------------------------------------------------------------------

function StyledItem(props: Readonly<AccordionItemProps>) {
  return <AccordionPrimitive.Item data-fw-accordion-item="" {...props} />;
}
StyledItem.displayName = 'Accordion.Item';

function StyledTrigger(props: Readonly<AccordionTriggerProps>) {
  return <AccordionPrimitive.Trigger data-fw-accordion-trigger="" {...props} />;
}
StyledTrigger.displayName = 'Accordion.Trigger';

function StyledContent(props: Readonly<AccordionContentProps>) {
  return <AccordionPrimitive.Content data-fw-accordion-content="" {...props} />;
}
StyledContent.displayName = 'Accordion.Content';

// ---------------------------------------------------------------------------
// Root wrapper
// ---------------------------------------------------------------------------

function StyledAccordionRoot(props: Readonly<AccordionProps>) {
  return <AccordionPrimitive {...props} />;
}
StyledAccordionRoot.displayName = 'Accordion';

// ---------------------------------------------------------------------------
// Compound component assembly
// ---------------------------------------------------------------------------

/**
 * Styled Accordion.
 *
 * Wraps the headless Accordion primitive with token-driven CSS.
 * Item, Trigger, and Content get styled wrappers. Root passes through.
 *
 * Requires `flintwork/styles/accordion.css` (or `flintwork/styles`) to be
 * imported for styles to apply.
 *
 * @example
 * ```tsx
 * import { Accordion } from 'flintwork';
 * import 'flintwork/styles/accordion.css';
 *
 * <Accordion type="single" defaultValue="item-1">
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>Section 1</Accordion.Trigger>
 *     <Accordion.Content>Content here</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */
export const Accordion = Object.assign(StyledAccordionRoot, {
  Item: StyledItem,
  Trigger: StyledTrigger,
  Content: StyledContent,
});

export type { AccordionProps, AccordionItemProps, AccordionTriggerProps, AccordionContentProps } from '../primitives/accordion';
