import { useCallback, type ComponentPropsWithoutRef } from 'react';
import { useTooltipContext } from './tooltip-context';

export interface TooltipContentProps extends ComponentPropsWithoutRef<'div'> {}

/**
 * The tooltip element. Renders a `<div>` with `role="tooltip"`.
 *
 * Only renders when the tooltip is open (Portal handles conditional
 * rendering). The content must be non-interactive — no links, buttons,
 * or form elements inside a tooltip. If you need interactive content,
 * use Popover instead.
 *
 * Mouse interaction: hovering over the tooltip content cancels the hide
 * delay, allowing users to read long tooltip text without it disappearing.
 * Moving the mouse away from the content restarts the hide delay.
 *
 * @example
 * ```tsx
 * <Tooltip.Content>
 *   Save your changes to disk
 * </Tooltip.Content>
 *
 * <Tooltip.Content className="tooltip-custom">
 *   <strong>Shortcut:</strong> Ctrl+S
 * </Tooltip.Content>
 * ```
 */
export function TooltipContent({ children, ...rest }: TooltipContentProps) {
  const { tooltipId, show, hide } = useTooltipContext();

  // Cancel hide when mouse enters tooltip content.
  // This lets users hover over the tooltip to read long text.
  // Calling `show` clears the hide timer without starting a new show delay
  // because the tooltip is already open.
  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const propsOnMouseEnter = rest.onMouseEnter;
      if (typeof propsOnMouseEnter === 'function') {
        propsOnMouseEnter(event);
      }
      show();
    },
    [rest.onMouseEnter, show],
  );

  // Restart hide delay when mouse leaves tooltip content.
  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const propsOnMouseLeave = rest.onMouseLeave;
      if (typeof propsOnMouseLeave === 'function') {
        propsOnMouseLeave(event);
      }
      hide();
    },
    [rest.onMouseLeave, hide],
  );

  return (
    <div
      id={tooltipId}
      role="tooltip"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </div>
  );
}
