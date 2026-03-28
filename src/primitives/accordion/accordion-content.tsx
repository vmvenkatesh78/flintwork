import { useAccordionItemContext } from './accordion-context';
import type { ComponentPropsWithoutRef } from 'react';

export interface AccordionContentProps extends ComponentPropsWithoutRef<'div'> {}

/**
 * The collapsible content panel for an accordion item.
 * Only renders when the item is open.
 *
 * ARIA attributes:
 * - `role="region"` — identifies the panel as a landmark for screen readers.
 *   WAI-ARIA APG recommends this for accordion panels. When collapsed,
 *   the region is removed from the DOM entirely (not hidden with
 *   `aria-hidden` or `display: none`), which means screen readers
 *   won't encounter it during navigation.
 * - `aria-labelledby` — points to the trigger button's id, so screen
 *   readers announce "region, Personal Information" when navigating
 *   by landmarks.
 *
 * Design decision: conditional rendering (unmount) vs hidden (display:none).
 * Unmounting is simpler and lighter. The tradeoff is that any state inside
 * the content resets when collapsed. For accordion content that typically
 * contains static text, this is fine. For content with forms or interactive
 * state, the consumer should lift that state up. A `forceMount` prop
 * can be added in v2 if needed.
 *
 * @example
 * ```tsx
 * <Accordion.Content>
 *   <p>This content is visible when the item is open.</p>
 * </Accordion.Content>
 * ```
 */
export function AccordionContent({ children, ...rest }: AccordionContentProps) {
  const { isOpen, triggerId, contentId } = useAccordionItemContext();

  if (!isOpen) return null;

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-state="open"
      {...rest}
    >
      {children}
    </div>
  );
}
