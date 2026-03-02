import { useId, useMemo } from 'react';
import { useControllable } from '../../hooks/use-controllable';
import { TabsContext } from './tabs-context';
import type { ReactNode } from 'react';

export interface TabsProps {
  /** Controlled selected tab value. */
  value?: string;
  /** Initial selected tab for uncontrolled usage. */
  defaultValue?: string;
  /** Called when the selected tab changes. */
  onValueChange?: (value: string) => void;
  /**
   * Arrow key direction for the tablist.
   * 'horizontal' = ArrowLeft/Right, 'vertical' = ArrowUp/Down.
   * Defaults to 'horizontal'.
   */
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
}

/**
 * Root Tabs component. Provides shared state to all compound children.
 * Renders no DOM element — this is a pure context provider.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Tabs defaultValue="account">...</Tabs>
 *
 * // Controlled
 * const [tab, setTab] = useState('account');
 * <Tabs value={tab} onValueChange={setTab}>...</Tabs>
 *
 * // Vertical
 * <Tabs defaultValue="account" orientation="vertical">...</Tabs>
 * ```
 */
export function TabsRoot({
  value: valueProp,
  defaultValue = '',
  onValueChange: onValueChangeProp,
  orientation = 'horizontal',
  children,
}: TabsProps) {
  const [selectedValue, setSelectedValue] = useControllable<string>(
    valueProp,
    defaultValue,
    onValueChangeProp,
  );

  const baseId = useId();

  const context = useMemo(
    () => ({
      selectedValue,
      onValueChange: setSelectedValue,
      orientation,
      baseId,
    }),
    [selectedValue, setSelectedValue, orientation, baseId],
  );

  return (
    <TabsContext.Provider value={context}>
      {children}
    </TabsContext.Provider>
  );
}
