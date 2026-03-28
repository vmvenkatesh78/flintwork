import { TooltipRoot } from './tooltip';
import { TooltipTrigger } from './tooltip-trigger';
import { TooltipPortal } from './tooltip-portal';
import { TooltipContent } from './tooltip-content';

/**
 * Tooltip compound component.
 *
 * Shows supplementary text on hover and focus. Non-interactive by design.
 * If you need interactive content inside a popup, use Popover.
 *
 * Accessibility:
 * - `role="tooltip"` on content
 * - `aria-describedby` on trigger pointing to tooltip
 * - Appears on both hover (with delay) and focus (immediate)
 * - Dismissable via Escape without moving focus
 * - No focus trap (tooltip content is not focusable)
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <Tooltip.Trigger>
 *     <button aria-label="Delete">🗑</button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Portal>
 *     <Tooltip.Content>Delete this item</Tooltip.Content>
 *   </Tooltip.Portal>
 * </Tooltip>
 *
 * // Custom delays
 * <Tooltip showDelay={400} hideDelay={100}>
 *   <Tooltip.Trigger>
 *     <span>Hover me</span>
 *   </Tooltip.Trigger>
 *   <Tooltip.Portal>
 *     <Tooltip.Content>Quick tooltip</Tooltip.Content>
 *   </Tooltip.Portal>
 * </Tooltip>
 * ```
 */
export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
});

export type { TooltipProps } from './tooltip';
export type { TooltipTriggerProps } from './tooltip-trigger';
export type { TooltipPortalProps } from './tooltip-portal';
export type { TooltipContentProps } from './tooltip-content';
