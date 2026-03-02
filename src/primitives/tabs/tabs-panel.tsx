import { useTabsContext, getTriggerId, getPanelId } from './tabs-context';
import type { ComponentPropsWithoutRef } from 'react';

export interface TabsPanelProps extends ComponentPropsWithoutRef<'div'> {
  /** The value that links this panel to its corresponding trigger. */
  value: string;
}

/**
 * Content panel for a tab. Renders a `<div>` with `role="tabpanel"`.
 * Only mounts when the panel's `value` matches the selected tab.
 *
 * `tabindex="0"` makes the panel focusable — this is the WAI-ARIA
 * pattern that lets Tab exit the tablist and land on the active panel
 * content. Without this, Tab would skip past the panel to the next
 * focusable element on the page.
 *
 * ARIA attributes:
 * - `role="tabpanel"`
 * - `id` — derived from baseId + value, linked from trigger's aria-controls
 * - `aria-labelledby` — points to the corresponding trigger's id
 * - `tabindex="0"` — panel is focusable for keyboard navigation
 *
 * @example
 * ```tsx
 * <Tabs.Panel value="account">
 *   <p>Account settings here</p>
 * </Tabs.Panel>
 * ```
 */
export function TabsPanel({ value, children, ...rest }: TabsPanelProps) {
  const { selectedValue, baseId } = useTabsContext();
  const isSelected = selectedValue === value;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      id={getPanelId(baseId, value)}
      aria-labelledby={getTriggerId(baseId, value)}
      tabIndex={0}
      data-state="active"
      {...rest}
    >
      {children}
    </div>
  );
}
