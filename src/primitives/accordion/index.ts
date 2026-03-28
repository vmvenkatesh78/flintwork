import { AccordionRoot } from './accordion';
import { AccordionItem } from './accordion-item';
import { AccordionTrigger } from './accordion-trigger';
import { AccordionContent } from './accordion-content';

/**
 * Accordion compound component.
 *
 * Vertically stacked sections where each section's content can be
 * expanded or collapsed by clicking its header.
 *
 * Supports single mode (one section open at a time) and multiple
 * mode (any number open simultaneously). Single mode has an optional
 * `collapsible` prop that allows all sections to be closed.
 *
 * Accessibility:
 * - Trigger renders inside an `<h3>` with `<button>`
 * - `aria-expanded` on trigger reflects open state
 * - `aria-controls` on trigger points to content panel
 * - `role="region"` on content with `aria-labelledby` pointing to trigger
 * - Enter/Space toggles (native button behavior)
 * - Each trigger is a regular button in the tab order
 *
 * @example
 * ```tsx
 * // Single mode
 * <Accordion type="single" defaultValue="item-1">
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>Personal Info</Accordion.Trigger>
 *     <Accordion.Content>Name, email, phone...</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="item-2">
 *     <Accordion.Trigger>Address</Accordion.Trigger>
 *     <Accordion.Content>Street, city, zip...</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 *
 * // Multiple mode
 * <Accordion type="multiple" defaultValue={["item-1"]}>
 *   ...
 * </Accordion>
 *
 * // Single collapsible
 * <Accordion type="single" collapsible>
 *   ...
 * </Accordion>
 * ```
 */
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export type { AccordionProps } from './accordion';
export type { AccordionItemProps } from './accordion-item';
export type { AccordionTriggerProps } from './accordion-trigger';
export type { AccordionContentProps } from './accordion-content';
