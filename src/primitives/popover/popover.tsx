import { useId, useRef, useMemo } from 'react';
import { useControllable } from '../../hooks/use-controllable';
import { PopoverContext } from './popover-context';
import type { ReactNode } from 'react';

export interface PopoverProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called when the popover wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/**
 * Root Popover component. Manages open state and provides context.
 * Renders no DOM element.
 *
 * Popover is a non-modal popup with interactive content. Key differences
 * from Dialog:
 * - No overlay
 * - No `aria-modal` (content behind remains accessible)
 * - Focus moves to content but is trapped (prevents losing context)
 * - Escape closes and restores focus to trigger
 * - Click outside closes
 *
 * If you need a modal popup with an overlay, use Dialog instead.
 * If you need a non-interactive text popup, use Tooltip instead.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Popover>
 *   <Popover.Trigger>
 *     <button>Settings</button>
 *   </Popover.Trigger>
 *   <Popover.Portal>
 *     <Popover.Content>
 *       <form>...</form>
 *       <Popover.Close>
 *         <button>Done</button>
 *       </Popover.Close>
 *     </Popover.Content>
 *   </Popover.Portal>
 * </Popover>
 *
 * // Controlled
 * <Popover open={open} onOpenChange={setOpen}>
 *   ...
 * </Popover>
 * ```
 */
export function PopoverRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange: onOpenChangeProp,
  children,
}: PopoverProps) {
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
    <PopoverContext.Provider value={context}>
      {children}
    </PopoverContext.Provider>
  );
}
