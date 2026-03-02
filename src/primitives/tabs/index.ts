import { TabsRoot } from './tabs';
import { TabsList } from './tabs-list';
import { TabsTrigger } from './tabs-trigger';
import { TabsPanel } from './tabs-panel';

/**
 * Tabs compound component with automatic activation.
 *
 * Arrow keys move focus between triggers AND select the corresponding
 * panel. Tab exits the tablist and lands on the active panel.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="account">
 *   <Tabs.List>
 *     <Tabs.Trigger value="account">Account</Tabs.Trigger>
 *     <Tabs.Trigger value="security">Security</Tabs.Trigger>
 *   </Tabs.List>
 *
 *   <Tabs.Panel value="account">Account settings</Tabs.Panel>
 *   <Tabs.Panel value="security">Security settings</Tabs.Panel>
 * </Tabs>
 * ```
 */
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel,
});

export type { TabsProps } from './tabs';
export type { TabsListProps } from './tabs-list';
export type { TabsTriggerProps } from './tabs-trigger';
export type { TabsPanelProps } from './tabs-panel';
