import type { ComponentPropsWithoutRef } from 'react';
import { Menu as MenuPrimitive } from '../primitives/menu';
import type { MenuProps, MenuItemProps } from '../primitives/menu';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StyledContent(props: Readonly<ComponentPropsWithoutRef<'div'>>) {
  return <MenuPrimitive.Content data-fw-menu-content="" {...props} />;
}
StyledContent.displayName = 'Menu.Content';

function StyledItem(props: Readonly<MenuItemProps>) {
  return <MenuPrimitive.Item data-fw-menu-item="" {...props} />;
}
StyledItem.displayName = 'Menu.Item';

// ---------------------------------------------------------------------------
// Root wrapper
// ---------------------------------------------------------------------------

function StyledMenuRoot(props: Readonly<MenuProps>) {
  return <MenuPrimitive {...props} />;
}
StyledMenuRoot.displayName = 'Menu';

// ---------------------------------------------------------------------------
// Compound component assembly
// ---------------------------------------------------------------------------

/**
 * Styled Menu.
 *
 * Wraps the headless Menu primitive with token-driven CSS.
 * Content and Item get styled wrappers. Root, Trigger, and Portal
 * pass through unchanged.
 *
 * Requires `flintwork/styles/menu.css` (or `flintwork/styles`).
 *
 * @example
 * ```tsx
 * import { Menu } from 'flintwork';
 * import 'flintwork/styles/menu.css';
 *
 * <Menu>
 *   <Menu.Trigger>
 *     <button>Actions</button>
 *   </Menu.Trigger>
 *   <Menu.Portal>
 *     <Menu.Content>
 *       <Menu.Item onSelect={handleEdit}>Edit</Menu.Item>
 *       <Menu.Item onSelect={handleDelete}>Delete</Menu.Item>
 *     </Menu.Content>
 *   </Menu.Portal>
 * </Menu>
 * ```
 */
export const Menu = Object.assign(StyledMenuRoot, {
  Trigger: MenuPrimitive.Trigger,
  Portal: MenuPrimitive.Portal,
  Content: StyledContent,
  Item: StyledItem,
});

export type { MenuProps, MenuItemProps } from '../primitives/menu';
export type { MenuTriggerProps, MenuPortalProps, MenuContentProps } from '../primitives/menu';
