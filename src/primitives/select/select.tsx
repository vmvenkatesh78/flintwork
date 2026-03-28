import { useId, useRef, useMemo } from 'react';
import { useControllable } from '../../hooks/use-controllable';
import { SelectContext } from './select-context';
import type { ReactNode } from 'react';

export interface SelectProps {
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value for uncontrolled usage. Defaults to `''`. */
  defaultValue?: string;
  /** Called when the selected value changes. */
  onValueChange?: (value: string) => void;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called when the listbox wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/**
 * Root Select component. Manages both selection state and open state.
 * Renders no DOM element.
 *
 * Select is a single-select listbox triggered by a button. For multi-select,
 * filtering, or text input, use a Combobox (future component).
 *
 * Two independent state axes:
 * - `value` / `onValueChange` — what is selected
 * - `open` / `onOpenChange` — whether the listbox is visible
 *
 * Both support controlled and uncontrolled usage independently.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Select defaultValue="red">
 *   <Select.Trigger>
 *     <Select.Value placeholder="Choose color" />
 *   </Select.Trigger>
 *   <Select.Portal>
 *     <Select.Content>
 *       <Select.Item value="red">Red</Select.Item>
 *       <Select.Item value="blue">Blue</Select.Item>
 *     </Select.Content>
 *   </Select.Portal>
 * </Select>
 *
 * // Controlled
 * <Select value={color} onValueChange={setColor}>
 *   ...
 * </Select>
 * ```
 */
export function SelectRoot({
  value: valueProp,
  defaultValue = '',
  onValueChange: onValueChangeProp,
  open: openProp,
  defaultOpen = false,
  onOpenChange: onOpenChangeProp,
  children,
}: SelectProps) {
  const [selectedValue, setSelectedValue] = useControllable<string>(
    valueProp,
    defaultValue,
    onValueChangeProp,
  );

  const [open, setOpen] = useControllable<boolean>(
    openProp,
    defaultOpen,
    onOpenChangeProp,
  );

  const contentId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const itemTextMap = useRef<Map<string, string>>(new Map());

  const context = useMemo(
    () => ({
      open,
      onOpenChange: setOpen,
      selectedValue,
      onValueChange: setSelectedValue,
      contentId,
      triggerRef,
      contentRef,
      itemTextMap,
    }),
    [open, setOpen, selectedValue, setSelectedValue, contentId],
  );

  return (
    <SelectContext.Provider value={context}>
      {children}
    </SelectContext.Provider>
  );
}
