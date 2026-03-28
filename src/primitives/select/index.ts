import { SelectRoot } from './select';
import { SelectTrigger } from './select-trigger';
import { SelectValue } from './select-value';
import { SelectPortal } from './select-portal';
import { SelectContent } from './select-content';
import { SelectItem } from './select-item';

/**
 * Select compound component.
 *
 * Single-select listbox triggered by a button. Selecting an option
 * updates the displayed value and closes the listbox.
 *
 * For multi-select, filtering, or text input, use Combobox (future).
 *
 * Accessibility:
 * - Trigger: `aria-haspopup="listbox"`, `aria-expanded`
 * - Content: `role="listbox"`
 * - Items: `role="option"`, `aria-selected`
 * - Arrow Up/Down navigates options (roving tabindex, wraps)
 * - Home/End jump to first/last option
 * - Typeahead: type to jump to matching option
 * - Enter/Space selects and closes
 * - Escape closes without changing selection
 * - Opens with focus on the currently selected item
 *
 * @example
 * ```tsx
 * <Select defaultValue="red">
 *   <Select.Trigger>
 *     <Select.Value placeholder="Choose a color" />
 *   </Select.Trigger>
 *   <Select.Portal>
 *     <Select.Content>
 *       <Select.Item value="red">Red</Select.Item>
 *       <Select.Item value="green">Green</Select.Item>
 *       <Select.Item value="blue">Blue</Select.Item>
 *     </Select.Content>
 *   </Select.Portal>
 * </Select>
 * ```
 */
export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Portal: SelectPortal,
  Content: SelectContent,
  Item: SelectItem,
});

export type { SelectProps } from './select';
export type { SelectTriggerProps } from './select-trigger';
export type { SelectValueProps } from './select-value';
export type { SelectPortalProps } from './select-portal';
export type { SelectContentProps } from './select-content';
export type { SelectItemProps } from './select-item';
