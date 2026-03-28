import { useId, useRef, useMemo } from 'react';
import { useControllable } from '../../hooks/use-controllable';
import { MenuContext } from './menu-context';
import type { ReactNode } from 'react';

export interface MenuProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called when the menu wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/**
 * Root Menu component. Manages open state and provides context.
 * Renders no DOM element.
 *
 * Menu is a dropdown of actionable items (role="menu" + role="menuitem").
 * Clicking an item performs an action and closes the menu.
 *
 * Key differences from other popup components:
 * - Popover: interactive content that stays open (forms, settings)
 * - Menu: list of actions that close on selection
 * - Dialog: modal with complex content
 * - Tooltip: non-interactive text
 *
 * @example
 * ```tsx
 * <Menu>
 *   <Menu.Trigger>
 *     <button>Actions</button>
 *   </Menu.Trigger>
 *   <Menu.Portal>
 *     <Menu.Content>
 *       <Menu.Item onSelect={() => handleEdit()}>Edit</Menu.Item>
 *       <Menu.Item onSelect={() => handleDelete()}>Delete</Menu.Item>
 *     </Menu.Content>
 *   </Menu.Portal>
 * </Menu>
 * ```
 */
export function MenuRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange: onOpenChangeProp,
  children,
}: MenuProps) {
  const [open, setOpen] = useControllable<boolean>(
    openProp,
    defaultOpen,
    onOpenChangeProp,
  );

  const contentId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  const context = useMemo(
    () => ({
      open,
      onOpenChange: setOpen,
      contentId,
      triggerRef,
      contentRef,
    }),
    [open, setOpen, contentId],
  );

  return (
    <MenuContext.Provider value={context}>
      {children}
    </MenuContext.Provider>
  );
}
