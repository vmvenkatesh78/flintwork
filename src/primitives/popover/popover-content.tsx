import { useEffect, useCallback, type ComponentPropsWithoutRef } from 'react';
import { usePopoverContext } from './popover-context';
import { useFocusTrap } from '../../hooks/use-focus-trap';
import { useClickOutside } from '../../hooks/use-click-outside';

export interface PopoverContentProps extends ComponentPropsWithoutRef<'div'> {}

/**
 * The popover content panel. Renders a `<div>` with interactive content.
 *
 * Key differences from Dialog.Content:
 * - No `aria-modal` — content behind remains accessible to screen readers
 * - No `role="dialog"` — uses no implicit role. The trigger's
 *   `aria-haspopup="dialog"` announces the relationship.
 * - Focus trap active — keeps keyboard users within the popover.
 *   Unlike Dialog, this is a choice: popover content is interactive
 *   (forms, links, buttons) so focus management is expected.
 *
 * Three hooks converge here (same as Dialog):
 * - `useFocusTrap` — traps Tab/Shift+Tab, restores focus on close
 * - `useClickOutside` — closes on outside click
 * - Escape handler — closes on Escape
 *
 * @example
 * ```tsx
 * <Popover.Content>
 *   <label>Name</label>
 *   <input type="text" />
 *   <Popover.Close>
 *     <button>Apply</button>
 *   </Popover.Close>
 * </Popover.Content>
 * ```
 */
export function PopoverContent({ children, ...rest }: PopoverContentProps) {
  const { onOpenChange, contentId, contentRef } = usePopoverContext();

  // Focus trap — same as Dialog. Always enabled because Content only
  // mounts when open. Restores focus to trigger on close.
  useFocusTrap(contentRef, { enabled: true });

  // Click outside — closes the popover.
  const handleClickOutside = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useClickOutside(contentRef, handleClickOutside);

  // Escape key — closes the popover.
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
      {...rest}
    >
      {children}
    </div>
  );
}
