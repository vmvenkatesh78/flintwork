import { useEffect, useCallback, useRef, type ComponentPropsWithoutRef } from 'react';
import { useMenuContext } from './menu-context';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { useClickOutside } from '../../hooks/use-click-outside';
import { useRovingTabIndex } from '../../hooks/use-roving-tabindex';

export interface MenuContentProps extends ComponentPropsWithoutRef<'div'> {}

// ---------------------------------------------------------------------------
// Typeahead constants
// ---------------------------------------------------------------------------

/**
 * Time in ms before the typeahead buffer resets. If the user doesn't
 * type another character within this window, the search string clears.
 * 500ms matches the behavior of native OS menus.
 */
const TYPEAHEAD_TIMEOUT = 500;

/**
 * Returns all menuitem elements inside the container.
 */
function getMenuItems(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>('[role="menuitem"]:not([data-disabled])'),
  );
}

/**
 * The menu content panel. Renders a `<div>` with `role="menu"`.
 *
 * Combines three interaction patterns:
 * 1. **Roving tabindex** — Arrow Up/Down navigates between items.
 *    Home/End jump to first/last. Wraps at boundaries.
 * 2. **Typeahead** — Typing a letter focuses the first item starting
 *    with that character. Typing multiple characters within 500ms
 *    builds a search string for longer matches.
 * 3. **Focus trap** — Tab/Shift+Tab stay within the menu.
 *    Focus restores to trigger on close.
 *
 * Dismissal:
 * - Escape closes, restores focus to trigger
 * - Click outside closes
 * - Item selection closes (handled by Menu.Item)
 *
 * @example
 * ```tsx
 * <Menu.Content>
 *   <Menu.Item onSelect={handleEdit}>Edit</Menu.Item>
 *   <Menu.Item onSelect={handleDuplicate}>Duplicate</Menu.Item>
 *   <Menu.Item onSelect={handleDelete} disabled>Delete</Menu.Item>
 * </Menu.Content>
 * ```
 */
export function MenuContent({ children, ...rest }: MenuContentProps) {
  const { onOpenChange, contentId, contentRef } = useMenuContext();

  // Focus trap
  useFocusTrap(contentRef, { enabled: true });

  // Click outside
  const handleClickOutside = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);
  useClickOutside(contentRef, handleClickOutside);

  // Roving tabindex — vertical orientation, wraps
  useRovingTabIndex(contentRef, {
    orientation: 'vertical',
    loop: true,
  });

  // -----------------------------------------------------------------------
  // Typeahead — type a character to jump to matching item
  // -----------------------------------------------------------------------

  const typeaheadBuffer = useRef('');
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTypeahead = useCallback(
    (event: KeyboardEvent) => {
      const container = contentRef.current;
      if (!container) return;

      // Only handle single printable characters
      if (event.key.length !== 1) return;
      // Ignore if modifier keys are held
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      event.preventDefault();

      // Build the search string
      typeaheadBuffer.current += event.key.toLowerCase();

      // Reset timer
      if (typeaheadTimer.current !== null) {
        clearTimeout(typeaheadTimer.current);
      }
      typeaheadTimer.current = setTimeout(() => {
        typeaheadBuffer.current = '';
        typeaheadTimer.current = null;
      }, TYPEAHEAD_TIMEOUT);

      // Find matching item
      const items = getMenuItems(container);
      const search = typeaheadBuffer.current;

      const match = items.find((item) => {
        const text = item.textContent?.toLowerCase().trim() ?? '';
        return text.startsWith(search);
      });

      if (match) {
        // Update roving tabindex
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
      role="menu"
      aria-orientation="vertical"
      {...rest}
    >
      {children}
    </div>
  );
}
