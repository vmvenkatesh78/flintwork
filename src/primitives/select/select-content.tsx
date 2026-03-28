import { useEffect, useCallback, useRef, type ComponentPropsWithoutRef } from 'react';
import { useSelectContext } from './select-context';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { useClickOutside } from '../../hooks/use-click-outside';
import { useRovingTabIndex } from '../../hooks/use-roving-tabindex';

export interface SelectContentProps extends ComponentPropsWithoutRef<'div'> {}

const TYPEAHEAD_TIMEOUT = 500;

function getOptionItems(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="option"]:not([data-disabled])'),
  );
}

/**
 * The listbox panel. Renders a `<div>` with `role="listbox"`.
 *
 * Combines:
 * 1. **Roving tabindex** — Arrow Up/Down navigates options. Wraps.
 * 2. **Typeahead** — Type to jump to matching option.
 * 3. **Focus trap** — Tab stays within the listbox.
 *
 * Selection: handled by Select.Item. When an item is selected, the
 * listbox closes and focus returns to the trigger.
 *
 * Dismissal:
 * - Escape closes without changing selection
 * - Click outside closes without changing selection
 *
 * @example
 * ```tsx
 * <Select.Content>
 *   <Select.Item value="red">Red</Select.Item>
 *   <Select.Item value="blue">Blue</Select.Item>
 * </Select.Content>
 * ```
 */
export function SelectContent({ children, ...rest }: SelectContentProps) {
  const { onOpenChange, contentId, contentRef, selectedValue } = useSelectContext();

  // Focus trap
  useFocusTrap(contentRef, { enabled: true });

  // Click outside
  const handleClickOutside = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);
  useClickOutside(contentRef, handleClickOutside);

  // Roving tabindex — vertical, wrapping
  useRovingTabIndex(contentRef, {
    orientation: 'vertical',
    loop: true,
  });

  // On open, focus the selected item if one exists
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    if (selectedValue) {
      const selectedItem = container.querySelector<HTMLElement>(
        `[role="option"][data-value="${selectedValue}"]`,
      );
      if (selectedItem) {
        // Set roving tabindex to selected item
        const items = getOptionItems(container);
        for (const item of items) {
          item.setAttribute('tabindex', '-1');
        }
        selectedItem.setAttribute('tabindex', '0');
        selectedItem.focus();
        return;
      }
    }

    // No selected value or selected item not found — focus first item
    const items = getOptionItems(container);
    if (items.length > 0) {
      const first = items[0];
      if (first) {
        for (const item of items) {
          item.setAttribute('tabindex', '-1');
        }
        first.setAttribute('tabindex', '0');
        first.focus();
      }
    }
  }, [contentRef, selectedValue]);

  // Typeahead
  const typeaheadBuffer = useRef('');
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTypeahead = useCallback(
    (event: KeyboardEvent) => {
      const container = contentRef.current;
      if (!container) return;

      if (event.key.length !== 1) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      event.preventDefault();

      typeaheadBuffer.current += event.key.toLowerCase();

      if (typeaheadTimer.current !== null) {
        clearTimeout(typeaheadTimer.current);
      }
      typeaheadTimer.current = setTimeout(() => {
        typeaheadBuffer.current = '';
        typeaheadTimer.current = null;
      }, TYPEAHEAD_TIMEOUT);

      const items = getOptionItems(container);
      const search = typeaheadBuffer.current;

      const match = items.find((item) => {
        const text = item.textContent?.toLowerCase().trim() ?? '';
        return text.startsWith(search);
      });

      if (match) {
        for (const item of items) {
          item.setAttribute('tabindex', '-1');
        }
        match.setAttribute('tabindex', '0');
        match.focus();
      }
    },
    [contentRef],
  );

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleTypeahead);

    return () => {
      container.removeEventListener('keydown', handleTypeahead);
      if (typeaheadTimer.current !== null) {
        clearTimeout(typeaheadTimer.current);
      }
    };
  }, [contentRef, handleTypeahead]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpenChange]);

  return (
    <div
      ref={(node: HTMLDivElement | null) => {
        (contentRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      id={contentId}
      role="listbox"
      {...rest}
    >
      {children}
    </div>
  );
}
