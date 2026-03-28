import { createPortal } from 'react-dom';
import { useTooltipContext } from './tooltip-context';
import type { ReactNode } from 'react';

export interface TooltipPortalProps {
  /** The DOM element to portal into. Defaults to `document.body`. */
  container?: HTMLElement;
  children: ReactNode;
}

/**
 * Renders children into a portal at the end of a container element.
 * Only renders when the tooltip is open.
 *
 * Breaks out of parent overflow, z-index, and stacking contexts.
 * Without this, a tooltip inside a container with `overflow: hidden`
 * would be clipped.
 *
 * @example
 * ```tsx
 * <Tooltip.Portal>
 *   <Tooltip.Content>Tooltip text</Tooltip.Content>
 * </Tooltip.Portal>
 *
 * // Custom container
 * <Tooltip.Portal container={myContainer}>
 *   <Tooltip.Content>Tooltip text</Tooltip.Content>
 * </Tooltip.Portal>
 * ```
 */
export function TooltipPortal({ container, children }: TooltipPortalProps) {
  const { open } = useTooltipContext();

  if (!open) return null;

  return createPortal(children, container ?? document.body);
}
