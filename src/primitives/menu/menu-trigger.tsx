import { cloneElement, isValidElement, useCallback } from 'react';
import { useMenuContext } from './menu-context';
import type { ReactElement, ReactNode } from 'react';

export interface MenuTriggerProps {
  children: ReactNode;
}

/**
 * Wraps the element that opens the menu. Renders its child directly.
 *
 * Attaches:
 * - `onClick` — toggles the menu
 * - `aria-haspopup="menu"` — announces a menu popup
 * - `aria-expanded` — reflects open state
 * - `aria-controls` — points to menu content (only when open)
 * - `ref` — stored for focus restoration on close
 *
 * @example
 * ```tsx
 * <Menu.Trigger>
 *   <button>Actions</button>
 * </Menu.Trigger>
 * ```
 */
export function MenuTrigger({ children }: MenuTriggerProps) {
  const { open, onOpenChange, contentId, triggerRef } = useMenuContext();

  const handleClick = useCallback(() => {
    onOpenChange(!open);
  }, [open, onOpenChange]);

  if (!isValidElement<Record<string, unknown>>(children)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[flintwork] Menu.Trigger expects a single React element as its child.',
      );
    }
    return null;
  }

  return cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;

      const childRef = (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef && typeof childRef === 'object') {
        (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onClick: (event: React.MouseEvent) => {
      const childOnClick = (children.props as Record<string, unknown>).onClick;
      if (typeof childOnClick === 'function') {
        childOnClick(event);
      }
      handleClick();
    },
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    ...(open ? { 'aria-controls': contentId } : {}),
  });
}
