import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState, useRef } from 'react';
import { Dialog } from './index';

// ---------------------------------------------------------------------------
// Helper: fully assembled dialog for most tests
// ---------------------------------------------------------------------------

function TestDialog({
  open: openProp,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  // If controlled props provided, use them. Otherwise use internal state.
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const open = openProp ?? internalOpen;
  const handleChange = onOpenChange ?? setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <Dialog.Trigger>
        <button data-testid="trigger">Open</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay data-testid="overlay" />
        <Dialog.Content data-testid="content">
          <Dialog.Title data-testid="title">Test Title</Dialog.Title>
          <Dialog.Description data-testid="description">
            Test description
          </Dialog.Description>
          <button data-testid="inside-btn">Inside</button>
          <Dialog.Close>
            <button data-testid="close-btn">Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('Dialog', () => {
  describe('rendering', () => {
    it('does not render portal content when closed', () => {
      render(<TestDialog />);

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    it('renders portal content when open', () => {
      render(<TestDialog defaultOpen />);

      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });

    it('renders content into document.body via portal', () => {
      render(<TestDialog defaultOpen />);

      const content = screen.getByTestId('content');
      // Portal renders as direct child of body, not inside the test root
      expect(content.parentElement).toBe(document.body);
    });

    it('renders title and description inside content', () => {
      render(<TestDialog defaultOpen />);

      expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
      expect(screen.getByTestId('description')).toHaveTextContent('Test description');
    });
  });

  // -----------------------------------------------------------------------
  // ARIA attributes
  // -----------------------------------------------------------------------

  describe('ARIA attributes', () => {
    it('content has role="dialog" and aria-modal="true"', () => {
      render(<TestDialog defaultOpen />);

      const content = screen.getByTestId('content');
      expect(content).toHaveAttribute('role', 'dialog');
      expect(content).toHaveAttribute('aria-modal', 'true');
    });

    it('content has aria-labelledby pointing to title', () => {
      render(<TestDialog defaultOpen />);

      const content = screen.getByTestId('content');
      const title = screen.getByTestId('title');
      expect(content).toHaveAttribute('aria-labelledby', title.id);
    });

    it('content has aria-describedby pointing to description', () => {
      render(<TestDialog defaultOpen />);

      const content = screen.getByTestId('content');
      const description = screen.getByTestId('description');
      expect(content).toHaveAttribute('aria-describedby', description.id);
    });

    it('content has an id for aria-controls', () => {
      render(<TestDialog defaultOpen />);

      const content = screen.getByTestId('content');
      expect(content.id).toBeTruthy();
    });

    it('trigger has aria-haspopup="dialog"', () => {
      render(<TestDialog />);

      expect(screen.getByTestId('trigger')).toHaveAttribute(
        'aria-haspopup',
        'dialog',
      );
    });

    it('trigger has aria-expanded reflecting open state', () => {
      render(<TestDialog />);

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('trigger has aria-controls pointing to content when open', () => {
      render(<TestDialog defaultOpen />);

      const trigger = screen.getByTestId('trigger');
      const content = screen.getByTestId('content');
      expect(trigger).toHaveAttribute('aria-controls', content.id);
    });

    it('trigger does not have aria-controls when closed', () => {
      render(<TestDialog />);

      expect(screen.getByTestId('trigger')).not.toHaveAttribute('aria-controls');
    });

    it('overlay has aria-hidden="true"', () => {
      render(<TestDialog defaultOpen />);

      expect(screen.getByTestId('overlay')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // -----------------------------------------------------------------------
  // Opening and closing
  // -----------------------------------------------------------------------

  describe('opening and closing', () => {
    it('opens when trigger is clicked', () => {
      render(<TestDialog />);

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('trigger'));
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('closes when close button is clicked', () => {
      render(<TestDialog defaultOpen />);

      expect(screen.getByTestId('content')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('close-btn'));
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('closes on Escape key', () => {
      render(<TestDialog defaultOpen />);

      expect(screen.getByTestId('content')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('closes on click outside content (mousedown on overlay)', () => {
      render(<TestDialog defaultOpen />);

      expect(screen.getByTestId('content')).toBeInTheDocument();

      // mousedown on overlay = outside the content panel
      fireEvent.mouseDown(screen.getByTestId('overlay'));
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('does not close on click inside content', () => {
      render(<TestDialog defaultOpen />);

      fireEvent.mouseDown(screen.getByTestId('inside-btn'));
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Focus management
  // -----------------------------------------------------------------------

  describe('focus management', () => {
    it('moves focus into content when opened', () => {
      render(<TestDialog />);

      fireEvent.click(screen.getByTestId('trigger'));

      // Focus should be inside the content panel (on first tabbable element)
      const content = screen.getByTestId('content');
      expect(content.contains(document.activeElement)).toBe(true);
    });

    it('focuses the first tabbable element inside content', () => {
      render(<TestDialog defaultOpen />);

      // First tabbable inside content is the "Inside" button
      expect(document.activeElement).toBe(screen.getByTestId('inside-btn'));
    });

    it('focuses [data-autofocus] element if present', () => {
      function AutofocusDialog() {
        const [open, setOpen] = useState(true);
        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
              <Dialog.Content data-testid="content">
                <Dialog.Title>Title</Dialog.Title>
                <button data-testid="first">First</button>
                <button data-testid="auto" data-autofocus>
                  Auto
                </button>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        );
      }

      render(<AutofocusDialog />);
      expect(document.activeElement).toBe(screen.getByTestId('auto'));
    });

    it('traps Tab within content', () => {
      render(<TestDialog defaultOpen />);

      const insideBtn = screen.getByTestId('inside-btn');
      const closeBtn = screen.getByTestId('close-btn');

      // Focus last element, Tab should wrap to first
      closeBtn.focus();
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(document.activeElement).toBe(insideBtn);
    });

    it('traps Shift+Tab within content', () => {
      render(<TestDialog defaultOpen />);

      const insideBtn = screen.getByTestId('inside-btn');
      const closeBtn = screen.getByTestId('close-btn');

      // Focus first element, Shift+Tab should wrap to last
      insideBtn.focus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(closeBtn);
    });

    it('restores focus to trigger on close', () => {
      render(<TestDialog />);

      const trigger = screen.getByTestId('trigger');
      trigger.focus();
      fireEvent.click(trigger);

      // Close with Escape
      fireEvent.keyDown(document, { key: 'Escape' });

      // Focus should be restored to trigger
      expect(document.activeElement).toBe(trigger);
    });

    it('restores focus to trigger when closing via close button', () => {
      render(<TestDialog />);

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
        <TestDialog open={false} onOpenChange={() => {}} />,
      );

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      rerender(<TestDialog open onOpenChange={() => {}} />);
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('calls onOpenChange when trigger is clicked', () => {
      const onOpenChange = vi.fn();
      render(<TestDialog open={false} onOpenChange={onOpenChange} />);

      fireEvent.click(screen.getByTestId('trigger'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange on Escape', () => {
      const onOpenChange = vi.fn();
      render(<TestDialog open onOpenChange={onOpenChange} />);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onOpenChange on click outside', () => {
      const onOpenChange = vi.fn();
      render(<TestDialog open onOpenChange={onOpenChange} />);

      fireEvent.mouseDown(screen.getByTestId('overlay'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onOpenChange when close button is clicked', () => {
      const onOpenChange = vi.fn();
      render(<TestDialog open onOpenChange={onOpenChange} />);

      fireEvent.click(screen.getByTestId('close-btn'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('consumer can prevent dismissal by not updating state', () => {
      // onOpenChange is called but does nothing — dialog stays open
      render(<TestDialog open onOpenChange={() => {}} />);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Uncontrolled mode
  // -----------------------------------------------------------------------

  describe('uncontrolled mode', () => {
    it('opens and closes with internal state', () => {
      function UncontrolledDialog() {
        return (
          <Dialog defaultOpen={false}>
            <Dialog.Trigger>
              <button data-testid="trigger">Open</button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content data-testid="content">
                <Dialog.Title>Title</Dialog.Title>
                <Dialog.Close>
                  <button data-testid="close">Close</button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        );
      }

      render(<UncontrolledDialog />);

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      fireEvent.click(screen.getByTestId('trigger'));
      expect(screen.getByTestId('content')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('close'));
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Trigger preserves child behavior
  // -----------------------------------------------------------------------

  describe('trigger child behavior', () => {
    it('calls child onClick alongside opening the dialog', () => {
      const childOnClick = vi.fn();

      function TriggerTest() {
        const [open, setOpen] = useState(false);
        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
              <button data-testid="trigger" onClick={childOnClick}>
                Open
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content data-testid="content">
                <Dialog.Title>Title</Dialog.Title>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        );
      }

      render(<TriggerTest />);
      fireEvent.click(screen.getByTestId('trigger'));

      expect(childOnClick).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('preserves child ref', () => {
      const refCallback = vi.fn();

      function RefTest() {
        const [open, setOpen] = useState(false);
        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
              <button ref={refCallback} data-testid="trigger">
                Open
              </button>
            </Dialog.Trigger>
          </Dialog>
        );
      }

      render(<RefTest />);
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });
  });

  // -----------------------------------------------------------------------
  // Close preserves child behavior
  // -----------------------------------------------------------------------

  describe('close child behavior', () => {
    it('calls child onClick alongside closing the dialog', () => {
      const childOnClick = vi.fn();

      function CloseTest() {
        const [open, setOpen] = useState(true);
        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
              <Dialog.Content>
                <Dialog.Title>Title</Dialog.Title>
                <Dialog.Close>
                  <button data-testid="close" onClick={childOnClick}>
                    Close
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
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
    it('throws when compound components are used outside Dialog root', () => {
      // Suppress console.error from React error boundary
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Dialog.Content><Dialog.Title>Title</Dialog.Title></Dialog.Content>);
      }).toThrow('[flintwork] Dialog compound components must be used within a <Dialog> root.');

      spy.mockRestore();
    });
  });
});
