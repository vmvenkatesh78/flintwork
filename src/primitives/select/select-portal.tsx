import { createPortal } from 'react-dom';
import { useSelectContext } from './select-context';
import type { ReactNode } from 'react';

export interface SelectPortalProps {
  container?: HTMLElement;
  children: ReactNode;
}

/**
 * Renders children into a portal. Only renders when the select is open.
 *
 * @example
 * ```tsx
 * <Select.Portal>
 *   <Select.Content>...</Select.Content>
 * </Select.Portal>
 * ```
 */
export function SelectPortal({ container, children }: SelectPortalProps) {
  const { open } = useSelectContext();

  if (!open) return null;

  return createPortal(children, container ?? document.body);
}
