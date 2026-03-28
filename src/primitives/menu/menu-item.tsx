import { useCallback, type ComponentPropsWithoutRef } from 'react';
import { useMenuContext } from './menu-context';

export interface MenuItemProps extends ComponentPropsWithoutRef<'div'> {
  /** Called when the item is selected (click or Enter/Space). */
  onSelect?: () => void;
  /** Whether this item is disabled. Disabled items are skipped by arrow keys. */
  disabled?: boolean;
}

/**
 * A single actionable item inside the menu. Renders a `<div>` with
 * `role="menuitem"`.
 *
 * When selected (click or Enter/Space), calls `onSelect` and closes
 * the menu. This is the fundamental difference from Popover content:
 * menu items are actions, not persistent controls.
 *
 * Uses `<div>` instead of `<button>` because `role="menuitem"` on a
 * `<button>` creates a redundant role announcement in some screen
 * readers ("button, menuitem, Edit"). A `<div>` with `role="menuitem"`
 * and `tabindex` is the correct pattern per WAI-ARIA APG.
 *
 * Disabled items:
 * - `aria-disabled="true"` (remains in accessibility tree)
 * - `data-disabled` (for CSS targeting)
 * - Skipped by arrow key navigation (useRovingTabIndex checks data-disabled)
 * - Click/Enter/Space does nothing
 *
 * @example
 * ```tsx
 * <Menu.Item onSelect={() => handleEdit()}>Edit</Menu.Item>
 * <Menu.Item onSelect={() => handleDelete()} disabled>Delete</Menu.Item>
 * ```
 */
export function MenuItem({
  onSelect,
  disabled = false,
  children,
  onClick,
  onKeyDown,
  ...rest
}: MenuItemProps) {
  const { onOpenChange } = useMenuContext();

  const handleSelect = useCallback(() => {
    if (disabled) return;
    onSelect?.();
    onOpenChange(false);
  }, [disabled, onSelect, onOpenChange]);

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
      role="menuitem"
      tabIndex={-1}
      data-roving-item=""
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
