import { createContext, useContext } from 'react';

export interface TabsContextValue {
  /** The currently selected tab value. */
  selectedValue: string;
  /** Update the selected tab. */
  onValueChange: (value: string) => void;
  /** Arrow key direction for the tablist. */
  orientation: 'horizontal' | 'vertical';
  /**
   * Base id from useId() in the root. Trigger and panel ids are derived
   * deterministically: `${baseId}-trigger-${value}` and `${baseId}-panel-${value}`.
   * No registration needed — both sides compute the other's id from the
   * shared baseId and value string.
   */
  baseId: string;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Returns the Tabs context. Throws if used outside a Tabs root.
 */
export function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      '[flintwork] Tabs compound components must be used within a <Tabs> root.',
    );
  }
  return context;
}

/**
 * Derive a trigger's DOM id from the base id and value.
 */
export function getTriggerId(baseId: string, value: string): string {
  return `${baseId}-trigger-${value}`;
}

/**
 * Derive a panel's DOM id from the base id and value.
 */
export function getPanelId(baseId: string, value: string): string {
  return `${baseId}-panel-${value}`;
}
