import { PopoverRoot } from './popover';
import { PopoverTrigger } from './popover-trigger';
import { PopoverPortal } from './popover-portal';
import { PopoverContent } from './popover-content';
import { PopoverClose } from './popover-close';

/**
 * Popover compound component.
 *
 * Non-modal popup for interactive content like forms, settings,
 * and filter panels. Unlike Dialog, there is no overlay and no
 * `aria-modal`. Unlike Tooltip, the content is interactive.
 *
 * Accessibility:
 * - Trigger toggles on click with `aria-haspopup` and `aria-expanded`
 * - Focus moves to first tabbable element on open
 * - Focus trapped within content
 * - Escape closes and restores focus to trigger
 * - Click outside closes
 *
 * @example
 * ```tsx
 * <Popover>
 *   <Popover.Trigger>
 *     <button>Settings</button>
 *   </Popover.Trigger>
 *   <Popover.Portal>
 *     <Popover.Content>
 *       <p>Popover content</p>
 *       <Popover.Close>
 *         <button>Done</button>
 *       </Popover.Close>
 *     </Popover.Content>
 *   </Popover.Portal>
 * </Popover>
 * ```
 */
export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Content: PopoverContent,
  Close: PopoverClose,
});

export type { PopoverProps } from './popover';
export type { PopoverTriggerProps } from './popover-trigger';
export type { PopoverPortalProps } from './popover-portal';
export type { PopoverContentProps } from './popover-content';
export type { PopoverCloseProps } from './popover-close';
