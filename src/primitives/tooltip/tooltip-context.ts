import { createContext, useContext } from 'react';

export interface TooltipContextValue {
  /** Whether the tooltip is currently visible. */
  open: boolean;
  /** Show the tooltip (starts show delay). */
  show: () => void;
  /** Hide the tooltip (starts hide delay). */
  hide: () => void;
  /** Show immediately with no delay (for focus). */
  showImmediate: () => void;
  /** Hide immediately with no delay (for blur/escape). */
  hideImmediate: () => void;
  /** Id for the tooltip content element. Trigger uses this for aria-describedby. */
  tooltipId: string;
}

export const TooltipContext = createContext<TooltipContextValue | null>(null);

/**
 * Returns the Tooltip context. Throws if used outside a Tooltip root.
 */
export function useTooltipContext(): TooltipContextValue {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error(
      '[flintwork] Tooltip compound components must be used within a <Tooltip> root.',
    );
  }
  return context;
}
