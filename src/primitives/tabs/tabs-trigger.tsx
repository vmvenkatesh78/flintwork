import { useCallback, type ComponentPropsWithoutRef } from 'react';
import { useTabsContext, getTriggerId, getPanelId } from './tabs-context';

export interface TabsTriggerProps extends ComponentPropsWithoutRef<'button'> {
  /** The value that links this trigger to its corresponding panel. */
  value: string;
  /** Whether this tab is disabled. Disabled tabs are skipped by arrow keys. */
  disabled?: boolean;
}

/**
 * Individual tab trigger. Renders a `<button>` with `role="tab"`.
 *
 * The `value` prop links this trigger to its `Tabs.Panel`. When clicked,
 * sets the selected value. When focused via arrow keys (automatic activation),
 * `Tabs.List`'s `onActiveChange` callback handles selection.
 *
 * ARIA attributes:
 * - `role="tab"`
 * - `aria-selected` — true when this trigger's value matches selection
 * - `aria-controls` — points to the corresponding panel's id
 * - `tabindex` — 0 if selected, -1 if not (roving tabindex pattern)
 * - `data-disabled` + `aria-disabled` when disabled (useRovingTabIndex skips these)
 * - `data-value` — read by Tabs.List's onActiveChange to bridge focus → selection
 *
 * @example
 * ```tsx
 * <Tabs.Trigger value="account">Account</Tabs.Trigger>
 * <Tabs.Trigger value="billing" disabled>Billing</Tabs.Trigger>
 * ```
 */
export function TabsTrigger({
  value,
  disabled = false,
  children,
  onClick,
  ...rest
}: TabsTriggerProps) {
  const { selectedValue, onValueChange, baseId } = useTabsContext();
  const isSelected = selectedValue === value;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(event);
      onValueChange(value);
    },
    [disabled, onClick, onValueChange, value],
  );

  return (
    <button
      type="button"
      role="tab"
      id={getTriggerId(baseId, value)}
      aria-selected={isSelected}
      aria-controls={getPanelId(baseId, value)}
      tabIndex={isSelected ? 0 : -1}
      data-value={value}
      data-state={isSelected ? 'active' : 'inactive'}
      {...(disabled
        ? { 'data-disabled': '', 'aria-disabled': true }
        : {})}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
