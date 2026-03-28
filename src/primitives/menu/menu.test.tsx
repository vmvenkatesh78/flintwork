import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Menu } from './index';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function TestMenu({
  open: openProp,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const open = openProp ?? internalOpen;
  const handleChange = onOpenChange ?? setInternalOpen;

  const onEdit = vi.fn();
  const onDuplicate = vi.fn();
  const onDelete = vi.fn();

  return (
    <Menu open={open} onOpenChange={handleChange}>
      <Menu.Trigger>
        <button data-testid="trigger">Actions</button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content data-testid="content">
          <Menu.Item data-testid="item-edit" onSelect={onEdit}>Edit</Menu.Item>
          <Menu.Item data-testid="item-duplicate" onSelect={onDuplicate}>Duplicate</Menu.Item>
          <Menu.Item data-testid="item-delete" onSelect={onDelete} disabled>Delete</Menu.Item>
          <Menu.Item data-testid="item-archive">Archive</Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('Menu', () => {
  describe('rendering', () => {
    it('does not render content when closed', () => {
      render(<TestMenu />);
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('renders content when open', () => {
      render(<TestMenu defaultOpen />);
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('renders all items', () => {
      render(<TestMenu defaultOpen />);
      expect(screen.getByTestId('item-edit')).toBeInTheDocument();
      expect(screen.getByTestId('item-duplicate')).toBeInTheDocument();
      expect(screen.getByTestId('item-delete')).toBeInTheDocument();
      expect(screen.getByTestId('item-archive')).toBeInTheDocument();
    });

    it('renders content into document.body via portal', () => {
      render(<TestMenu defaultOpen />);
      expect(screen.getByTestId('content').parentElement).toBe(document.body);
    });
  });

  // -----------------------------------------------------------------------
  // ARIA attributes
  // -----------------------------------------------------------------------

  describe('ARIA attributes', () => {
    it('content has role="menu"', () => {
      render(<TestMenu defaultOpen />);
      expect(screen.getByTestId('content')).toHaveAttribute('role', 'menu');
    });

    it('content has aria-orientation="vertical"', () => {
      render(<TestMenu defaultOpen />);
      expect(screen.getByTestId('content')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('items have role="menuitem"', () => {
      render(<TestMenu defaultOpen />);
      expect(screen.getByTestId('item-edit')).toHaveAttribute('role', 'menuitem');
    });

    it('trigger has aria-haspopup="menu"', () => {
      render(<TestMenu />);
      expect(screen.getByTestId('trigger')).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('trigger has aria-expanded reflecting open state', () => {
      render(<TestMenu />);
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('trigger has aria-controls pointing to content when open', () => {
      render(<TestMenu defaultOpen />);
      const trigger = screen.getByTestId('trigger');
      const content = screen.getByTestId('content');
      expect(trigger).toHaveAttribute('aria-controls', content.id);
    });

    it('trigger does not have aria-controls when closed', () => {
      render(<TestMenu />);
      expect(screen.getByTestId('trigger')).not.toHaveAttribute('aria-controls');
    });

    it('disabled item has aria-disabled and data-disabled', () => {
      render(<TestMenu defaultOpen />);
      expect(screen.getByTestId('item-delete')).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByTestId('item-delete')).toHaveAttribute('data-disabled');
    });
  });

  // -----------------------------------------------------------------------
  // Opening and closing
  // -----------------------------------------------------------------------

  describe('opening and closing', () => {
    it('opens on trigger click', () => {
      render(<TestMenu />);
      fireEvent.click(screen.getByTestId('trigger'));
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('closes on trigger click when open (toggle)', () => {
      render(<TestMenu defaultOpen />);
      fireEvent.click(screen.getByTestId('trigger'));
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('closes on Escape', () => {
      render(<TestMenu defaultOpen />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('closes on click outside', () => {
      render(<TestMenu defaultOpen />);
      fireEvent.mouseDown(document.body);
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('does not close on click inside content', () => {
      render(<TestMenu defaultOpen />);
      fireEvent.mouseDown(screen.getByTestId('content'));
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Item selection
  // -----------------------------------------------------------------------

  describe('item selection', () => {
    it('calls onSelect and closes menu on click', () => {
      const onSelect = vi.fn();

      function SelectTest() {
        const [open, setOpen] = useState(true);
        return (
          <Menu open={open} onOpenChange={setOpen}>
            <Menu.Trigger><button>Actions</button></Menu.Trigger>
            <Menu.Portal>
              <Menu.Content>
                <Menu.Item data-testid="item" onSelect={onSelect}>Edit</Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu>
        );
      }

      render(<SelectTest />);
      fireEvent.click(screen.getByTestId('item'));

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('item')).not.toBeInTheDocument();
    });

    it('calls onSelect on Enter key', () => {
      const onSelect = vi.fn();

      function EnterTest() {
        const [open, setOpen] = useState(true);
        return (
          <Menu open={open} onOpenChange={setOpen}>
            <Menu.Trigger><button>Actions</button></Menu.Trigger>
            <Menu.Portal>
              <Menu.Content>
                <Menu.Item data-testid="item" onSelect={onSelect}>Edit</Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu>
        );
      }

      render(<EnterTest />);
      fireEvent.keyDown(screen.getByTestId('item'), { key: 'Enter' });

      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('calls onSelect on Space key', () => {
      const onSelect = vi.fn();

      function SpaceTest() {
        const [open, setOpen] = useState(true);
        return (
          <Menu open={open} onOpenChange={setOpen}>
            <Menu.Trigger><button>Actions</button></Menu.Trigger>
            <Menu.Portal>
              <Menu.Content>
                <Menu.Item data-testid="item" onSelect={onSelect}>Edit</Menu.Item>
              </Menu.Content>
            </Menu.Portal>
          </Menu>
        );
      }

      render(<SpaceTest />);
      fireEvent.keyDown(screen.getByTestId('item'), { key: ' ' });

      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('disabled item does not call onSelect', () => {
      const onSelect = vi.fn();

      render(
        <Menu defaultOpen>
          <Menu.Trigger><button>Actions</button></Menu.Trigger>
          <Menu.Portal>
            <Menu.Content>
              <Menu.Item data-testid="item" onSelect={onSelect} disabled>
                Delete
              </Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        </Menu>,
      );

      fireEvent.click(screen.getByTestId('item'));
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // Keyboard navigation
  // -----------------------------------------------------------------------

  describe('keyboard navigation', () => {
    it('ArrowDown moves focus to next item', () => {
      render(<TestMenu defaultOpen />);

      screen.getByTestId('item-edit').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'ArrowDown' });

      expect(document.activeElement).toBe(screen.getByTestId('item-duplicate'));
    });

    it('ArrowUp moves focus to previous item', () => {
      render(<TestMenu defaultOpen />);

      screen.getByTestId('item-duplicate').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'ArrowUp' });

      expect(document.activeElement).toBe(screen.getByTestId('item-edit'));
    });

    it('ArrowDown skips disabled items', () => {
      render(<TestMenu defaultOpen />);

      screen.getByTestId('item-duplicate').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'ArrowDown' });

      // Should skip "Delete" (disabled) and land on "Archive"
      expect(document.activeElement).toBe(screen.getByTestId('item-archive'));
    });

    it('ArrowDown wraps from last to first', () => {
      render(<TestMenu defaultOpen />);

      screen.getByTestId('item-archive').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'ArrowDown' });

      expect(document.activeElement).toBe(screen.getByTestId('item-edit'));
    });

    it('Home moves to first item', () => {
      render(<TestMenu defaultOpen />);

      screen.getByTestId('item-archive').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'Home' });

      expect(document.activeElement).toBe(screen.getByTestId('item-edit'));
    });

    it('End moves to last item', () => {
      render(<TestMenu defaultOpen />);

      screen.getByTestId('item-edit').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'End' });

      expect(document.activeElement).toBe(screen.getByTestId('item-archive'));
    });
  });

  // -----------------------------------------------------------------------
  // Typeahead
  // -----------------------------------------------------------------------

  describe('typeahead', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it('focuses item matching typed character', () => {
      render(<TestMenu defaultOpen />);

      screen.getByTestId('item-edit').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'a' });

      expect(document.activeElement).toBe(screen.getByTestId('item-archive'));
    });

    it('builds multi-character search within timeout', () => {
      render(<TestMenu defaultOpen />);

      screen.getByTestId('item-edit').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'd' });
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'u' });

      // "du" should match "Duplicate", not "Delete" (disabled)
      expect(document.activeElement).toBe(screen.getByTestId('item-duplicate'));
    });
  });

  // -----------------------------------------------------------------------
  // Focus management
  // -----------------------------------------------------------------------

  describe('focus management', () => {
    it('moves focus into content when opened', () => {
      render(<TestMenu />);

      fireEvent.click(screen.getByTestId('trigger'));
      const content = screen.getByTestId('content');
      expect(content.contains(document.activeElement)).toBe(true);
    });

    it('restores focus to trigger on close via Escape', () => {
      render(<TestMenu />);

      const trigger = screen.getByTestId('trigger');
      trigger.focus();
      fireEvent.click(trigger);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(document.activeElement).toBe(trigger);
    });
  });

  // -----------------------------------------------------------------------
  // Context boundary
  // -----------------------------------------------------------------------

  describe('context boundary', () => {
    it('throws when used outside Menu root', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Menu.Content><Menu.Item>Orphan</Menu.Item></Menu.Content>);
      }).toThrow(
        '[flintwork] Menu compound components must be used within a <Menu> root.',
      );

      spy.mockRestore();
    });
  });
});
