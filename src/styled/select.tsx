import type { ComponentPropsWithoutRef } from 'react';
import { Select as SelectPrimitive } from '../primitives/select';
import type { SelectProps, SelectTriggerProps, SelectItemProps } from '../primitives/select';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StyledTrigger(props: Readonly<SelectTriggerProps>) {
  return <SelectPrimitive.Trigger data-fw-select-trigger="" {...props} />;
}
StyledTrigger.displayName = 'Select.Trigger';

function StyledContent(props: Readonly<ComponentPropsWithoutRef<'div'>>) {
  return <SelectPrimitive.Content data-fw-select-content="" {...props} />;
}
StyledContent.displayName = 'Select.Content';

function StyledItem(props: Readonly<SelectItemProps>) {
  return <SelectPrimitive.Item data-fw-select-item="" {...props} />;
}
StyledItem.displayName = 'Select.Item';

// ---------------------------------------------------------------------------
// Root wrapper
// ---------------------------------------------------------------------------

function StyledSelectRoot(props: Readonly<SelectProps>) {
  return <SelectPrimitive {...props} />;
}
StyledSelectRoot.displayName = 'Select';

// ---------------------------------------------------------------------------
// Compound component assembly
// ---------------------------------------------------------------------------

/**
 * Styled Select.
 *
 * Wraps the headless Select primitive with token-driven CSS.
 * Trigger, Content, and Item get styled wrappers. Root, Value,
 * and Portal pass through unchanged.
 *
 * Requires `flintwork/styles/select.css` (or `flintwork/styles`).
 *
 * @example
 * ```tsx
 * import { Select } from 'flintwork';
 * import 'flintwork/styles/select.css';
 *
 * <Select defaultValue="red">
 *   <Select.Trigger>
 *     <Select.Value placeholder="Color" />
 *   </Select.Trigger>
 *   <Select.Portal>
 *     <Select.Content>
 *       <Select.Item value="red">Red</Select.Item>
 *       <Select.Item value="blue">Blue</Select.Item>
 *     </Select.Content>
 *   </Select.Portal>
 * </Select>
 * ```
 */
export const Select = Object.assign(StyledSelectRoot, {
  Trigger: StyledTrigger,
  Value: SelectPrimitive.Value,
  Portal: SelectPrimitive.Portal,
  Content: StyledContent,
  Item: StyledItem,
});

export type { SelectProps, SelectTriggerProps, SelectItemProps } from '../primitives/select';
export type { SelectValueProps, SelectPortalProps, SelectContentProps } from '../primitives/select';
