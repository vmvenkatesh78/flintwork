import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Select } from './index';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function TestSelect({
  defaultValue = '',
  defaultOpen = false,
}: {
  defaultValue?: string;
  defaultOpen?: boolean;
} = {}) {
  return (
    <Select defaultValue={defaultValue} defaultOpen={defaultOpen}>
      <Select.Trigger data-testid="trigger">
        <Select.Value placeholder="Choose color" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content data-testid="content">
          <Select.Item value="red" data-testid="item-red">Red</Select.Item>
          <Select.Item value="green" data-testid="item-green">Green</Select.Item>
          <Select.Item value="blue" data-testid="item-blue">Blue</Select.Item>
          <Select.Item value="gray" data-testid="item-gray" disabled>Gray</Select.Item>
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('Select', () => {
  describe('rendering', () => {
    it('does not render listbox when closed', () => {
      render(<TestSelect />);
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('renders listbox when open', () => {
      render(<TestSelect defaultOpen />);
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('renders all items', () => {
      render(<TestSelect defaultOpen />);
      expect(screen.getByTestId('item-red')).toBeInTheDocument();
      expect(screen.getByTestId('item-green')).toBeInTheDocument();
      expect(screen.getByTestId('item-blue')).toBeInTheDocument();
      expect(screen.getByTestId('item-gray')).toBeInTheDocument();
    });

    it('shows placeholder when no value selected', () => {
      render(<TestSelect />);
      expect(screen.getByText('Choose color')).toBeInTheDocument();
    });

    it('shows selected value text', () => {
      render(<TestSelect defaultValue="red" />);
      expect(screen.getByText('red')).toBeInTheDocument();
    });

    it('renders listbox into document.body via portal', () => {
      render(<TestSelect defaultOpen />);
      expect(screen.getByTestId('content').parentElement).toBe(document.body);
    });
  });

  // -----------------------------------------------------------------------
  // ARIA attributes
  // -----------------------------------------------------------------------

  describe('ARIA attributes', () => {
    it('content has role="listbox"', () => {
      render(<TestSelect defaultOpen />);
      expect(screen.getByTestId('content')).toHaveAttribute('role', 'listbox');
    });

    it('items have role="option"', () => {
      render(<TestSelect defaultOpen />);
      expect(screen.getByTestId('item-red')).toHaveAttribute('role', 'option');
    });

    it('selected item has aria-selected="true"', () => {
      render(<TestSelect defaultValue="red" defaultOpen />);
      expect(screen.getByTestId('item-red')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('item-green')).toHaveAttribute('aria-selected', 'false');
    });

    it('trigger has aria-haspopup="listbox"', () => {
      render(<TestSelect />);
      expect(screen.getByTestId('trigger')).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('trigger has aria-expanded reflecting open state', () => {
      render(<TestSelect />);
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('trigger has aria-controls pointing to content when open', () => {
      render(<TestSelect defaultOpen />);
      const trigger = screen.getByTestId('trigger');
      const content = screen.getByTestId('content');
      expect(trigger).toHaveAttribute('aria-controls', content.id);
    });

    it('trigger does not have aria-controls when closed', () => {
      render(<TestSelect />);
      expect(screen.getByTestId('trigger')).not.toHaveAttribute('aria-controls');
    });

    it('trigger has type="button"', () => {
      render(<TestSelect />);
      expect(screen.getByTestId('trigger')).toHaveAttribute('type', 'button');
    });

    it('disabled item has aria-disabled and data-disabled', () => {
      render(<TestSelect defaultOpen />);
      expect(screen.getByTestId('item-gray')).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByTestId('item-gray')).toHaveAttribute('data-disabled');
    });
  });

  // -----------------------------------------------------------------------
  // Opening and closing
  // -----------------------------------------------------------------------

  describe('opening and closing', () => {
    it('opens on trigger click', () => {
      render(<TestSelect />);
      fireEvent.click(screen.getByTestId('trigger'));
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('closes on trigger click when open', () => {
      render(<TestSelect defaultOpen />);
      fireEvent.click(screen.getByTestId('trigger'));
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('closes on Escape without changing selection', () => {
      render(<TestSelect defaultValue="red" defaultOpen />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      expect(screen.getByText('Red')).toBeInTheDocument();
    });

    it('closes on click outside', () => {
      render(<TestSelect defaultOpen />);
      fireEvent.mouseDown(document.body);
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Selection
  // -----------------------------------------------------------------------

  describe('selection', () => {
    it('selects item on click and closes', () => {
      render(<TestSelect />);
      fireEvent.click(screen.getByTestId('trigger'));
      fireEvent.click(screen.getByTestId('item-green'));

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      expect(screen.getByText('Green')).toBeInTheDocument();
    });

    it('selects item on Enter and closes', () => {
      render(<TestSelect defaultOpen />);
      const item = screen.getByTestId('item-green');
      item.focus();
      fireEvent.keyDown(item, { key: 'Enter' });

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      expect(screen.getByText('Green')).toBeInTheDocument();
    });

    it('selects item on Space and closes', () => {
      render(<TestSelect defaultOpen />);
      const item = screen.getByTestId('item-blue');
      item.focus();
      fireEvent.keyDown(item, { key: ' ' });

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
    });

    it('disabled item cannot be selected', () => {
      render(<TestSelect defaultOpen />);
      fireEvent.click(screen.getByTestId('item-gray'));

      // Should still be open, no selection changed
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('updates aria-selected after selection', () => {
      render(<TestSelect defaultValue="red" />);
      fireEvent.click(screen.getByTestId('trigger'));
      fireEvent.click(screen.getByTestId('item-blue'));

      // Reopen to check
      fireEvent.click(screen.getByTestId('trigger'));
      expect(screen.getByTestId('item-blue')).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('item-red')).toHaveAttribute('aria-selected', 'false');
    });

    it('shows data-state="checked" on selected item', () => {
      render(<TestSelect defaultValue="red" defaultOpen />);
      expect(screen.getByTestId('item-red')).toHaveAttribute('data-state', 'checked');
      expect(screen.getByTestId('item-green')).toHaveAttribute('data-state', 'unchecked');
    });
  });

  // -----------------------------------------------------------------------
  // Keyboard navigation
  // -----------------------------------------------------------------------

  describe('keyboard navigation', () => {
    it('ArrowDown moves to next item', () => {
      render(<TestSelect defaultOpen />);
      screen.getByTestId('item-red').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'ArrowDown' });
      expect(document.activeElement).toBe(screen.getByTestId('item-green'));
    });

    it('ArrowUp moves to previous item', () => {
      render(<TestSelect defaultOpen />);
      screen.getByTestId('item-green').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'ArrowUp' });
      expect(document.activeElement).toBe(screen.getByTestId('item-red'));
    });

    it('ArrowDown skips disabled items', () => {
      render(<TestSelect defaultOpen />);
      screen.getByTestId('item-blue').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'ArrowDown' });
      // Should skip gray (disabled) and wrap to red
      expect(document.activeElement).toBe(screen.getByTestId('item-red'));
    });

    it('Home moves to first item', () => {
      render(<TestSelect defaultOpen />);
      screen.getByTestId('item-blue').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'Home' });
      expect(document.activeElement).toBe(screen.getByTestId('item-red'));
    });

    it('End moves to last non-disabled item', () => {
      render(<TestSelect defaultOpen />);
      screen.getByTestId('item-red').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'End' });
      // Gray is disabled, so should land on blue
      // Actually End goes to the last item in the roving set, which excludes disabled
      expect(document.activeElement).toBe(screen.getByTestId('item-blue'));
    });
  });

  // -----------------------------------------------------------------------
  // Focus on open
  // -----------------------------------------------------------------------

  describe('focus on open', () => {
    it('focuses selected item when opening', () => {
      render(<TestSelect defaultValue="green" />);
      fireEvent.click(screen.getByTestId('trigger'));
      expect(document.activeElement).toBe(screen.getByTestId('item-green'));
    });

    it('focuses first item when no selection', () => {
      render(<TestSelect />);
      fireEvent.click(screen.getByTestId('trigger'));
      expect(document.activeElement).toBe(screen.getByTestId('item-red'));
    });
  });

  // -----------------------------------------------------------------------
  // Typeahead
  // -----------------------------------------------------------------------

  describe('typeahead', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it('focuses item matching typed character', () => {
      render(<TestSelect defaultOpen />);
      screen.getByTestId('item-red').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'b' });
      expect(document.activeElement).toBe(screen.getByTestId('item-blue'));
    });

    it('builds multi-character search', () => {
      render(<TestSelect defaultOpen />);
      screen.getByTestId('item-red').focus();
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'g' });
      fireEvent.keyDown(screen.getByTestId('content'), { key: 'r' });
      // "gr" should match "Green", not "Gray" (disabled)
      expect(document.activeElement).toBe(screen.getByTestId('item-green'));
    });
  });

  // -----------------------------------------------------------------------
  // Controlled mode
  // -----------------------------------------------------------------------

  describe('controlled mode', () => {
    it('respects controlled value', () => {
      function Controlled() {
        const [value, setValue] = useState('red');
        return (
          <Select value={value} onValueChange={setValue}>
            <Select.Trigger data-testid="trigger">
              <Select.Value />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content data-testid="content">
                <Select.Item value="red" data-testid="item-red">Red</Select.Item>
                <Select.Item value="blue" data-testid="item-blue">Blue</Select.Item>
              </Select.Content>
            </Select.Portal>
          </Select>
        );
      }

      render(<Controlled />);
      expect(screen.getByText('red')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('trigger'));
      fireEvent.click(screen.getByTestId('item-blue'));

      expect(screen.getByText('Blue')).toBeInTheDocument();
    });

    it('calls onValueChange on selection', () => {
      const onValueChange = vi.fn();

      render(
        <Select value="red" onValueChange={onValueChange} defaultOpen>
          <Select.Trigger><Select.Value /></Select.Trigger>
          <Select.Portal>
            <Select.Content>
              <Select.Item value="blue" data-testid="item-blue">Blue</Select.Item>
            </Select.Content>
          </Select.Portal>
        </Select>,
      );

      fireEvent.click(screen.getByTestId('item-blue'));
      expect(onValueChange).toHaveBeenCalledWith('blue');
    });
  });

  // -----------------------------------------------------------------------
  // Focus restoration
  // -----------------------------------------------------------------------

  describe('focus restoration', () => {
    it('restores focus to trigger on close via Escape', () => {
      render(<TestSelect />);
      const trigger = screen.getByTestId('trigger');
      trigger.focus();
      fireEvent.click(trigger);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(document.activeElement).toBe(trigger);
    });

    it('restores focus to trigger on selection', () => {
      render(<TestSelect />);
      const trigger = screen.getByTestId('trigger');
      trigger.focus();
      fireEvent.click(trigger);

      fireEvent.click(screen.getByTestId('item-green'));
      expect(document.activeElement).toBe(trigger);
    });
  });

  // -----------------------------------------------------------------------
  // Context boundary
  // -----------------------------------------------------------------------

  describe('context boundary', () => {
    it('throws when used outside Select root', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Select.Content><Select.Item value="x">X</Select.Item></Select.Content>);
      }).toThrow(
        '[flintwork] Select compound components must be used within a <Select> root.',
      );

      spy.mockRestore();
    });
  });
});
