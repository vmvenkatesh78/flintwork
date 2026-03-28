import { useSelectContext } from './select-context';

export interface SelectValueProps {
  /** Text shown when no value is selected. */
  placeholder?: string;
}

/**
 * Displays the text of the currently selected item, or a placeholder
 * if nothing is selected.
 *
 * Reads from the `itemTextMap` registry that Select.Item populates on
 * mount. This means the consumer doesn't need to pass display text
 * separately from the item list.
 *
 * Must be used inside Select.Trigger.
 *
 * @example
 * ```tsx
 * <Select.Trigger>
 *   <Select.Value placeholder="Choose a color" />
 * </Select.Trigger>
 * ```
 */
export function SelectValue({ placeholder = '' }: SelectValueProps) {
  const { selectedValue, itemTextMap } = useSelectContext();

  if (!selectedValue) {
    return <span data-placeholder="">{placeholder}</span>;
  }

  const displayText = itemTextMap.current.get(selectedValue) ?? selectedValue;

  return <span>{displayText}</span>;
}
