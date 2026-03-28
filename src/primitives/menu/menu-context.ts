import { createContext, useContext } from 'react';

export interface MenuContextValue {
  /** Whether the menu is currently open. */
  open: boolean;
  /** Toggle the menu. */
  onOpenChange: (open: boolean) => void;
  /** Id for the menu content. Trigger uses this for aria-controls. */
  contentId: string;
  /** Ref to the trigger element for focus restoration. */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Ref to the content panel for focus trap and click-outside. */
  contentRef: React.RefObject<HTMLElement | null>;
}

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext(): MenuContextValue {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error(
      '[flintwork] Menu compound components must be used within a <Menu> root.',
    );
  }
  return context;
}
