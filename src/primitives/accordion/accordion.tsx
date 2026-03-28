import { useMemo, useCallback } from 'react';
import { useControllable } from '../../hooks/use-controllable';
import { AccordionContext } from './accordion-context';
import type { ReactNode } from 'react';

export interface AccordionProps {
  /**
   * `"single"` — only one item open at a time. Opening one closes the other.
   * `"multiple"` — any number of items can be open simultaneously.
   */
  type: 'single' | 'multiple';
  /**
   * Controlled open state. A single value string for `type="single"`,
   * or an array of value strings for `type="multiple"`.
   */
  value?: string | string[];
  /**
   * Initial open state for uncontrolled usage.
   * A single value string for `type="single"`, or an array for `type="multiple"`.
   */
  defaultValue?: string | string[];
  /** Called when the open state changes. */
  onValueChange?: (value: string | string[]) => void;
  /**
   * When `type="single"`, whether clicking the open item closes it.
   * Defaults to `false` (one item always stays open).
   * Ignored when `type="multiple"`.
   */
  collapsible?: boolean;
  children: ReactNode;
}

/**
 * Root Accordion component. Manages which items are open.
 * Renders a `<div>` as the container.
 *
 * Supports both single (one open at a time) and multiple (any number open)
 * modes. Both controlled and uncontrolled usage via `useControllable`.
 *
 * @example
 * ```tsx
 * // Single mode — one open at a time
 * <Accordion type="single" defaultValue="item-1">
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>Section 1</Accordion.Trigger>
 *     <Accordion.Content>Content 1</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="item-2">
 *     <Accordion.Trigger>Section 2</Accordion.Trigger>
 *     <Accordion.Content>Content 2</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 *
 * // Multiple mode — any number open
 * <Accordion type="multiple" defaultValue={["item-1", "item-3"]}>
 *   ...
 * </Accordion>
 *
 * // Single collapsible — all items can be closed
 * <Accordion type="single" collapsible defaultValue="item-1">
 *   ...
 * </Accordion>
 * ```
 */
export function AccordionRoot({
  type,
  value: valueProp,
  defaultValue,
  onValueChange: onValueChangeProp,
  collapsible = false,
  children,
}: AccordionProps) {
  // Normalize to array internally for uniform handling.
  // Single mode: string becomes [string], undefined becomes [].
  // Multiple mode: already an array or defaults to [].
  const normalizeToArray = (v: string | string[] | undefined): string[] => {
    if (v === undefined) return [];
    if (Array.isArray(v)) return v;
    return [v];
  };

  const [openValues, setOpenValues] = useControllable<string[]>(
    valueProp !== undefined ? normalizeToArray(valueProp) : undefined,
    normalizeToArray(defaultValue),
    // Bridge: convert internal array back to the consumer's expected type.
    // Single mode consumers expect a string, multiple mode expects string[].
    (next: string[]) => {
      if (!onValueChangeProp) return;
      if (type === 'single') {
        onValueChangeProp(next[0] ?? '');
      } else {
        onValueChangeProp(next);
      }
    },
  );

  const toggle = useCallback(
    (itemValue: string) => {
      const isOpen = openValues.includes(itemValue);

      if (type === 'single') {
        if (isOpen) {
          // Closing the open item — only allowed if collapsible
          if (collapsible) {
            setOpenValues([]);
          }
        } else {
          // Opening a new item — closes the current one
          setOpenValues([itemValue]);
        }
      } else {
        // Multiple mode — toggle independently
        if (isOpen) {
          setOpenValues(openValues.filter((v) => v !== itemValue));
        } else {
          setOpenValues([...openValues, itemValue]);
        }
      }
    },
    [type, collapsible, openValues, setOpenValues],
  );

  const context = useMemo(
    () => ({ openValues, toggle }),
    [openValues, toggle],
  );

  return (
    <AccordionContext.Provider value={context}>
      <div data-accordion="">{children}</div>
    </AccordionContext.Provider>
  );
}
