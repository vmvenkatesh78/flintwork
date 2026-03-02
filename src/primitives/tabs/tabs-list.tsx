import { useRef, useCallback, type ComponentPropsWithoutRef } from 'react';
import { useTabsContext } from './tabs-context';
import { useRovingTabIndex } from '../../hooks/use-roving-tabindex';

export interface TabsListProps extends ComponentPropsWithoutRef<'div'> {}

/**
 * The tablist container. Renders a `<div>` with `role="tablist"` and
 * `aria-orientation`.
 *
 * This is where `useRovingTabIndex` attaches. The hook manages which
 * trigger has `tabindex="0"` vs `tabindex="-1"` and handles arrow key
 * focus movement.
 *
 * Automatic activation: when the roving hook moves focus to a new trigger
 * via arrow keys, `onActiveChange` fires. The callback reads the newly
 * focused element's `data-value` attribute and updates the selected tab.
 * This means arrow keys both move focus AND select — the WAI-ARIA default
 * for most tab interfaces.
 *
 * @example
 * ```tsx
 * <Tabs.List>
 *   <Tabs.Trigger value="account">Account</Tabs.Trigger>
 *   <Tabs.Trigger value="security">Security</Tabs.Trigger>
 * </Tabs.List>
 * ```
 */
export function TabsList({ children, ...rest }: TabsListProps) {
  const { onValueChange, orientation } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);

  // Bridge: useRovingTabIndex moves focus → onActiveChange fires →
  // we read the focused trigger's value and update selection.
  const handleActiveChange = useCallback(() => {
    // Safe to read activeElement here because useRovingTabIndex calls
    // focus() synchronously before invoking this callback. If the hook
    // ever becomes async, this read would need to accept the focused
    // element as a callback argument instead.
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && focused.dataset.value) {
      onValueChange(focused.dataset.value);
    }
  }, [onValueChange]);

  useRovingTabIndex(listRef, {
    orientation,
    loop: true,
    onActiveChange: handleActiveChange,
  });

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      {...rest}
    >
      {children}
    </div>
  );
}
