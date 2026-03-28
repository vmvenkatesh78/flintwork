import { MenuRoot } from './menu';
import { MenuTrigger } from './menu-trigger';
import { MenuPortal } from './menu-portal';
import { MenuContent } from './menu-content';
import { MenuItem } from './menu-item';

/**
 * Menu compound component.
 *
 * Dropdown list of actionable items. Selecting an item performs an
 * action and closes the menu. For persistent interactive content
 * (forms, settings), use Popover instead.
 *
 * Accessibility:
 * - `role="menu"` on content, `role="menuitem"` on items
 * - Trigger has `aria-haspopup="menu"` and `aria-expanded`
 * - Arrow Up/Down navigates items (roving tabindex, wraps)
 * - Home/End jump to first/last item
 * - Typeahead: typing a character focuses matching item
 * - Enter/Space selects the focused item
 * - Escape closes and restores focus to trigger
 * - Click outside closes
 * - Disabled items are skipped by arrow keys
 *
 * @example
 * ```tsx
 * <Menu>
 *   <Menu.Trigger>
 *     <button>Actions</button>
 *   </Menu.Trigger>
 *   <Menu.Portal>
 *     <Menu.Content>
 *       <Menu.Item onSelect={() => edit()}>Edit</Menu.Item>
 *       <Menu.Item onSelect={() => duplicate()}>Duplicate</Menu.Item>
 *       <Menu.Item onSelect={() => remove()} disabled>Delete</Menu.Item>
 *     </Menu.Content>
 *   </Menu.Portal>
 * </Menu>
 * ```
 */
export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Content: MenuContent,
  Item: MenuItem,
});

export type { MenuProps } from './menu';
export type { MenuTriggerProps } from './menu-trigger';
export type { MenuPortalProps } from './menu-portal';
export type { MenuContentProps } from './menu-content';
export type { MenuItemProps } from './menu-item';
