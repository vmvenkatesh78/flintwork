import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Popover } from './index';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function TestPopover({
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

  return (
    <Popover open={open} onOpenChange={handleChange}>
      <Popover.Trigger>
        <button data-testid="trigger">Open</button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content data-testid="content">
          <input data-testid="input" placeholder="Name" />
          <button data-testid="inside-btn">Apply</button>
          <Popover.Close>
            <button data-testid="close-btn">Done</button>
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('Popover', () => {
  describe('rendering', () => {
    it('does not render content when closed', () => {
      render(<TestPopover />);

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('renders content when open', () => {
      render(<TestPopover defaultOpen />);

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('renders content into document.body via portal', () => {
      render(<TestPopover defaultOpen />);

      const content = screen.getByTestId('content');
      expect(content.parentElement).toBe(document.body);
    });
  });

  // -----------------------------------------------------------------------
  // ARIA attributes
  // -----------------------------------------------------------------------

  describe('ARIA attributes', () => {
    it('does not have aria-modal (non-modal)', () => {
      render(<TestPopover defaultOpen />);

      expect(screen.getByTestId('content')).not.toHaveAttribute('aria-modal');
    });

    it('does not have role="dialog" (no implicit role)', () => {
      render(<TestPopover defaultOpen />);

      expect(screen.getByTestId('content')).not.toHaveAttribute('role');
    });

    it('content has an id for aria-controls', () => {
      render(<TestPopover defaultOpen />);

      expect(screen.getByTestId('content').id).toBeTruthy();
    });

    it('trigger has aria-haspopup="dialog"', () => {
      render(<TestPopover />);

      expect(screen.getByTestId('trigger')).toHaveAttribute(
        'aria-haspopup',
        'dialog',
      );
    });

    it('trigger has aria-expanded reflecting open state', () => {
      render(<TestPopover />);

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('trigger has aria-controls pointing to content when open', () => {
      render(<TestPopover defaultOpen />);

      const trigger = screen.getByTestId('trigger');
      const content = screen.getByTestId('content');
      expect(trigger).toHaveAttribute('aria-controls', content.id);
    });

    it('trigger does not have aria-controls when closed', () => {
      render(<TestPopover />);

      expect(screen.getByTestId('trigger')).not.toHaveAttribute('aria-controls');
    });
  });

  // -----------------------------------------------------------------------
  // Opening and closing
  // -----------------------------------------------------------------------

  describe('opening and closing', () => {
    it('opens on trigger click', () => {
      render(<TestPopover />);

      fireEvent.click(screen.getByTestId('trigger'));
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('closes on trigger click when open (toggle)', () => {
      render(<TestPopover defaultOpen />);

      fireEvent.click(screen.getByTestId('trigger'));
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('closes on close button click', () => {
      render(<TestPopover defaultOpen />);

      fireEvent.click(screen.getByTestId('close-btn'));
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('closes on Escape', () => {
      render(<TestPopover defaultOpen />);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('closes on click outside', () => {
      render(<TestPopover defaultOpen />);

      fireEvent.mouseDown(document.body);
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('does not close on click inside content', () => {
      render(<TestPopover defaultOpen />);

      fireEvent.mouseDown(screen.getByTestId('inside-btn'));
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Focus management
  // -----------------------------------------------------------------------

  describe('focus management', () => {
    it('moves focus into content when opened', () => {
      render(<TestPopover />);

      fireEvent.click(screen.getByTestId('trigger'));

      const content = screen.getByTestId('content');
      expect(content.contains(document.activeElement)).toBe(true);
    });

    it('focuses the first tabbable element inside content', () => {
      render(<TestPopover defaultOpen />);

      expect(document.activeElement).toBe(screen.getByTestId('input'));
    });

    it('traps Tab within content', () => {
      render(<TestPopover defaultOpen />);

      const closeBtn = screen.getByTestId('close-btn');
      const input = screen.getByTestId('input');

      closeBtn.focus();
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(document.activeElement).toBe(input);
    });

    it('traps Shift+Tab within content', () => {
      render(<TestPopover defaultOpen />);

      const input = screen.getByTestId('input');
      const closeBtn = screen.getByTestId('close-btn');

      input.focus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(closeBtn);
    });

    it('restores focus to trigger on close via Escape', () => {
      render(<TestPopover />);

      const trigger = screen.getByTestId('trigger');
      trigger.focus();
      fireEvent.click(trigger);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(document.activeElement).toBe(trigger);
    });

    it('restores focus to trigger on close via close button', () => {
      render(<TestPopover />);

      const trigger = screen.getByTestId('trigger');
      trigger.focus();
      fireEvent.click(trigger);

      fireEvent.click(screen.getByTestId('close-btn'));
      expect(document.activeElement).toBe(trigger);
    });
  });

  // -----------------------------------------------------------------------
  // Controlled mode
  // -----------------------------------------------------------------------

  describe('controlled mode', () => {
    it('respects controlled open prop', () => {
      const { rerender } = render(
        <TestPopover open={false} onOpenChange={() => {}} />,
      );

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      rerender(<TestPopover open onOpenChange={() => {}} />);
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('calls onOpenChange on trigger click', () => {
      const onOpenChange = vi.fn();
      render(<TestPopover open={false} onOpenChange={onOpenChange} />);

      fireEvent.click(screen.getByTestId('trigger'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange with false on Escape', () => {
      const onOpenChange = vi.fn();
      render(<TestPopover open onOpenChange={onOpenChange} />);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onOpenChange with false on click outside', () => {
      const onOpenChange = vi.fn();
      render(<TestPopover open onOpenChange={onOpenChange} />);

      fireEvent.mouseDown(document.body);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('consumer can prevent dismissal', () => {
      render(<TestPopover open onOpenChange={() => {}} />);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Uncontrolled mode
  // -----------------------------------------------------------------------

  describe('uncontrolled mode', () => {
    it('opens and closes with internal state', () => {
      function Uncontrolled() {
        return (
          <Popover defaultOpen={false}>
            <Popover.Trigger>
              <button data-testid="trigger">Open</button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content data-testid="content">
                <Popover.Close>
                  <button data-testid="close">Close</button>
                </Popover.Close>
              </Popover.Content>
            </Popover.Portal>
          </Popover>
        );
      }

      render(<Uncontrolled />);

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('trigger'));
      expect(screen.getByTestId('content')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('close'));
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Trigger and Close preserve child behavior
  // -----------------------------------------------------------------------

  describe('child behavior', () => {
    it('trigger preserves child onClick', () => {
      const childOnClick = vi.fn();

      function ClickTest() {
        const [open, setOpen] = useState(false);
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <Popover.Trigger>
              <button data-testid="trigger" onClick={childOnClick}>Open</button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content data-testid="content">Content</Popover.Content>
            </Popover.Portal>
          </Popover>
        );
      }

      render(<ClickTest />);
      fireEvent.click(screen.getByTestId('trigger'));

      expect(childOnClick).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('trigger preserves child ref', () => {
      const refCallback = vi.fn();

      function RefTest() {
        const [open, setOpen] = useState(false);
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <Popover.Trigger>
              <button ref={refCallback} data-testid="trigger">Open</button>
            </Popover.Trigger>
          </Popover>
        );
      }

      render(<RefTest />);
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it('close preserves child onClick', () => {
      const childOnClick = vi.fn();

      function CloseTest() {
        const [open, setOpen] = useState(true);
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <Popover.Portal>
              <Popover.Content>
                <Popover.Close>
                  <button data-testid="close" onClick={childOnClick}>Done</button>
                </Popover.Close>
              </Popover.Content>
            </Popover.Portal>
          </Popover>
        );
      }

      render(<CloseTest />);
      fireEvent.click(screen.getByTestId('close'));

      expect(childOnClick).toHaveBeenCalledTimes(1);
    });
  });

  // -----------------------------------------------------------------------
  // Context boundary
  // -----------------------------------------------------------------------

  describe('context boundary', () => {
    it('throws when used outside Popover root', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Popover.Content>Orphan</Popover.Content>);
      }).toThrow(
        '[flintwork] Popover compound components must be used within a <Popover> root.',
      );

      spy.mockRestore();
    });
  });
});
