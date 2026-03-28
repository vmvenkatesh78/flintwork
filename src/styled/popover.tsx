import type { ComponentPropsWithoutRef } from 'react';
import { Popover as PopoverPrimitive } from '../primitives/popover';
import type { PopoverProps } from '../primitives/popover';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StyledContent(props: Readonly<ComponentPropsWithoutRef<'div'>>) {
  return <PopoverPrimitive.Content data-fw-popover-content="" {...props} />;
}
StyledContent.displayName = 'Popover.Content';

// ---------------------------------------------------------------------------
// Root wrapper
// ---------------------------------------------------------------------------

function StyledPopoverRoot(props: Readonly<PopoverProps>) {
  return <PopoverPrimitive {...props} />;
}
StyledPopoverRoot.displayName = 'Popover';

// ---------------------------------------------------------------------------
// Compound component assembly
// ---------------------------------------------------------------------------

/**
 * Styled Popover.
 *
 * Wraps the headless Popover primitive with token-driven CSS.
 * Only Content gets a styled wrapper. Root, Trigger, Portal,
 * and Close pass through unchanged.
 *
 * Requires `flintwork/styles/popover.css` (or `flintwork/styles`).
 *
 * @example
 * ```tsx
 * import { Popover } from 'flintwork';
 * import 'flintwork/styles/popover.css';
 *
 * <Popover>
 *   <Popover.Trigger>
 *     <button>Settings</button>
 *   </Popover.Trigger>
 *   <Popover.Portal>
 *     <Popover.Content>
 *       <p>Settings content</p>
 *       <Popover.Close>
 *         <button>Done</button>
 *       </Popover.Close>
 *     </Popover.Content>
 *   </Popover.Portal>
 * </Popover>
 * ```
 */
export const Popover = Object.assign(StyledPopoverRoot, {
  Trigger: PopoverPrimitive.Trigger,
  Portal: PopoverPrimitive.Portal,
  Content: StyledContent,
  Close: PopoverPrimitive.Close,
});

export type { PopoverProps } from '../primitives/popover';
export type { PopoverTriggerProps, PopoverPortalProps, PopoverContentProps, PopoverCloseProps } from '../primitives/popover';
