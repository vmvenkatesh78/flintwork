import type { ComponentPropsWithoutRef } from 'react';
import { Tabs as TabsPrimitive } from '../primitives/tabs';
import type { TabsProps, TabsTriggerProps, TabsPanelProps } from '../primitives/tabs';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StyledTabsListProps extends ComponentPropsWithoutRef<'div'> {}

// ---------------------------------------------------------------------------
// Sub-components — only wrap the ones that produce styled DOM
// ---------------------------------------------------------------------------

function StyledList(props: Readonly<StyledTabsListProps>) {
  return <TabsPrimitive.List data-fw-tabs-list="" {...props} />;
}
StyledList.displayName = 'Tabs.List';

function StyledTrigger(props: Readonly<TabsTriggerProps>) {
  return <TabsPrimitive.Trigger data-fw-tabs-trigger="" {...props} />;
}
StyledTrigger.displayName = 'Tabs.Trigger';

function StyledPanel(props: Readonly<TabsPanelProps>) {
  return <TabsPrimitive.Panel data-fw-tabs-panel="" {...props} />;
}
StyledPanel.displayName = 'Tabs.Panel';

// ---------------------------------------------------------------------------
// Root wrapper — prevents Object.assign from mutating the primitive
// ---------------------------------------------------------------------------

function StyledTabsRoot(props: Readonly<TabsProps>) {
  return <TabsPrimitive {...props} />;
}
StyledTabsRoot.displayName = 'Tabs';

// ---------------------------------------------------------------------------
// Compound component assembly
// ---------------------------------------------------------------------------

/**
 * Styled Tabs.
 *
 * Wraps the headless Tabs primitive with token-driven CSS. Root passes
 * through as a wrapper function — not mutated via Object.assign on
 * the primitive directly.
 *
 * Requires `flintwork/styles/tabs.css` (or `flintwork/styles`) to be
 * imported for styles to apply.
 *
 * @example
 * ```tsx
 * import { Tabs } from 'flintwork';
 * import 'flintwork/styles/tabs.css';
 *
 * <Tabs defaultValue="account">
 *   <Tabs.List>
 *     <Tabs.Trigger value="account">Account</Tabs.Trigger>
 *     <Tabs.Trigger value="security">Security</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Panel value="account">Account settings</Tabs.Panel>
 *   <Tabs.Panel value="security">Security settings</Tabs.Panel>
 * </Tabs>
 * ```
 */
export const Tabs = Object.assign(StyledTabsRoot, {
  List: StyledList,
  Trigger: StyledTrigger,
  Panel: StyledPanel,
});

export type { TabsProps, TabsTriggerProps, TabsPanelProps } from '../primitives/tabs';
export type { StyledTabsListProps as TabsListProps };