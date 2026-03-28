import type { ComponentPropsWithoutRef } from 'react';
import { Tooltip as TooltipPrimitive } from '../primitives/tooltip';
import type { TooltipProps } from '../primitives/tooltip';

// ---------------------------------------------------------------------------
// Sub-components — only wrap the ones that produce styled DOM
// ---------------------------------------------------------------------------

function StyledContent(props: Readonly<ComponentPropsWithoutRef<'div'>>) {
  return <TooltipPrimitive.Content data-fw-tooltip-content="" {...props} />;
}
StyledContent.displayName = 'Tooltip.Content';

// ---------------------------------------------------------------------------
// Root wrapper
// ---------------------------------------------------------------------------

function StyledTooltipRoot(props: Readonly<TooltipProps>) {
  return <TooltipPrimitive {...props} />;
}
StyledTooltipRoot.displayName = 'Tooltip';

// ---------------------------------------------------------------------------
// Compound component assembly
// ---------------------------------------------------------------------------

/**
 * Styled Tooltip.
 *
 * Wraps the headless Tooltip primitive with token-driven CSS. Only
 * Content gets a styled wrapper (the only sub-component with visible DOM).
 * Root, Trigger, and Portal pass through unchanged.
 *
 * Requires `flintwork/styles/tooltip.css` (or `flintwork/styles`) to be
 * imported for styles to apply.
 *
 * @example
 * ```tsx
 * import { Tooltip } from 'flintwork';
 * import 'flintwork/styles/tooltip.css';
 *
 * <Tooltip>
 *   <Tooltip.Trigger>
 *     <button>Save</button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Portal>
 *     <Tooltip.Content>Save your changes</Tooltip.Content>
 *   </Tooltip.Portal>
 * </Tooltip>
 * ```
 */
export const Tooltip = Object.assign(StyledTooltipRoot, {
  Trigger: TooltipPrimitive.Trigger,
  Portal: TooltipPrimitive.Portal,
  Content: StyledContent,
});

export type { TooltipProps } from '../primitives/tooltip';
export type { TooltipTriggerProps, TooltipPortalProps, TooltipContentProps } from '../primitives/tooltip';
