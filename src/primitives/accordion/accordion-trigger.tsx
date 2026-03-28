import { useCallback, type ComponentPropsWithoutRef } from 'react';
import { useAccordionContext, useAccordionItemContext } from './accordion-context';

export interface AccordionTriggerProps extends ComponentPropsWithoutRef<'button'> {
  /** Whether this trigger is disabled. Prevents toggle on click. */
  disabled?: boolean;
}

/**
 * The button that toggles an accordion item open/closed.
 * Renders a `<h3>` containing a `<button>`.
 *
 * The heading level is h3 by default. This is an opinionated choice
 * because accordion sections are typically sub-sections within a page.
 * If the consumer needs a different heading level, they should wrap
 * the trigger in their own heading element and pass `asChild` (future)
 * or compose manually.
 *
 * ARIA attributes:
 * - `aria-expanded` — whether the associated content is visible
 * - `aria-controls` — points to the content panel's id
 * - `aria-disabled` — set when disabled (button remains focusable)
 * - `data-state` — "open" or "closed" for CSS targeting
 * - `data-disabled` — present when disabled for CSS targeting
 *
 * Keyboard: Enter and Space toggle (native button behavior, no custom
 * handler needed). The WAI-ARIA APG also suggests optional Up/Down
 * arrow navigation between headers, but this is not implemented in v1.
 * Each trigger is a regular button in the tab order.
 *
 * @example
 * ```tsx
 * <Accordion.Trigger>Personal Information</Accordion.Trigger>
 * <Accordion.Trigger disabled>Locked Section</Accordion.Trigger>
 * ```
 */
export function AccordionTrigger({
  disabled = false,
  children,
  onClick,
  ...rest
}: AccordionTriggerProps) {
  const { toggle } = useAccordionContext();
  const { value, isOpen, triggerId, contentId } = useAccordionItemContext();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(event);
      toggle(value);
    },
    [disabled, onClick, toggle, value],
  );

  return (
    <h3 style={{ margin: 0 }}>
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        data-state={isOpen ? 'open' : 'closed'}
        {...(disabled
          ? { 'data-disabled': '', 'aria-disabled': true }
          : {})}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </button>
    </h3>
  );
}
