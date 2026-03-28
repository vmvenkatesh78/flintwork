import { useCallback, useEffect, useRef, type ComponentPropsWithoutRef } from 'react';
import { useSelectContext } from './select-context';

export interface SelectItemProps extends ComponentPropsWithoutRef<'div'> {
  /** The value this option represents. */
  value: string;
  /** Whether this option is disabled. */
  disabled?: boolean;
}

/**
 * A single option in the select listbox. Renders a `<div>` with
 * `role="option"`.
 *
 * When selected (click or Enter/Space), updates the selected value
 * and closes the listbox.
 *
 * Registers its text content in the parent's `itemTextMap` on mount
 * so Select.Value can display the text without the consumer having
 * to pass it separately.
 *
 * ARIA attributes:
 * - `role="option"`
 * - `aria-selected` — true when this item's value matches selection
 * - `data-value` — used by Content to find the selected item on open
 * - `data-disabled` + `aria-disabled` when disabled
 * - `data-state` — "checked" or "unchecked" for CSS
 *
 * @example
 * ```tsx
 * <Select.Item value="red">Red</Select.Item>
 * <Select.Item value="blue" disabled>Blue (out of stock)</Select.Item>
 * ```
 */
export function SelectItem({
  value,
  disabled = false,
  children,
  onClick,
  onKeyDown,
  ...rest
}: SelectItemProps) {
  const { selectedValue, onValueChange, onOpenChange, itemTextMap } =
    useSelectContext();

  const isSelected = selectedValue === value;
  const itemRef = useRef<HTMLDivElement>(null);

  // Register display text for Select.Value
  useEffect(() => {
    const text = itemRef.current?.textContent?.trim() ?? value;
    itemTextMap.current.set(value, text);

    return () => {
      itemTextMap.current.delete(value);
    };
  }, [value, itemTextMap, children]);

  const handleSelect = useCallback(() => {
    if (disabled) return;
    onValueChange(value);
    onOpenChange(false);
  }, [disabled, value, onValueChange, onOpenChange]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      handleSelect();
    },
    [onClick, handleSelect],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSelect();
      }
    },
    [onKeyDown, handleSelect],
  );

  return (
    <div
      ref={itemRef}
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
      data-roving-item=""
      data-value={value}
      data-state={isSelected ? 'checked' : 'unchecked'}
      {...(disabled
        ? { 'data-disabled': '', 'aria-disabled': true }
        : {})}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}
