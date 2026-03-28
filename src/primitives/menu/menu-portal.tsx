import { createPortal } from 'react-dom';
import { useMenuContext } from './menu-context';
import type { ReactNode } from 'react';

export interface MenuPortalProps {
  container?: HTMLElement;
  children: ReactNode;
}

/**
 * Renders children into a portal. Only renders when the menu is open.
 *
 * @example
 * ```tsx
 * <Menu.Portal>
 *   <Menu.Content>...</Menu.Content>
 * </Menu.Portal>
 * ```
 */
export function MenuPortal({ container, children }: MenuPortalProps) {
  const { open } = useMenuContext();

  if (!open) return null;

  return createPortal(children, container ?? document.body);
}
