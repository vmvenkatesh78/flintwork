import { useCallback, type ComponentPropsWithoutRef } from 'react';
import { useSelectContext } from './select-context';

export interface SelectTriggerProps extends ComponentPropsWithoutRef<'button'> {}

/**
 * The button that opens the select listbox. Renders a `<button>`.
 *
 * Unlike Dialog/Popover/Menu triggers which use cloneElement, Select
 * trigger renders its own button. This is because Select.Value needs
 * to live inside the trigger and read context, which requires the
 * trigger to be a real component with children, not a wrapper.
 *
 * ARIA attributes:
 * - `aria-haspopup="listbox"` — announces a listbox popup
 * - `aria-expanded` — reflects open state
 * - `aria-controls` — points to listbox content (only when open)
 *
 * @example
 * ```tsx
 * <Select.Trigger>
 *   <Select.Value placeholder="Choose..." />
 * </Select.Trigger>
 * ```
 */
export function SelectTrigger({ children, onClick, ...rest }: SelectTriggerProps) {
  const { open, onOpenChange, contentId, triggerRef } = useSelectContext();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      onOpenChange(!open);
    },
    [onClick, open, onOpenChange],
  );

  return (
    <button
      ref={(node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      {...(open ? { 'aria-controls': contentId } : {})}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
