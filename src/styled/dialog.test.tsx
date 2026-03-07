import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Dialog } from './dialog';

// ---------------------------------------------------------------------------
// Test harness — controlled Dialog with all sub-components
// ---------------------------------------------------------------------------

function DialogHarness({
  defaultOpen = false,
  size,
}: Readonly<{
  defaultOpen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}>) {
  const [open, setOpen] = useState(defaultOpen);

  // Build Content props conditionally — exactOptionalPropertyTypes
  // doesn't allow passing undefined for an optional property.
  const contentProps: { 'data-testid': string; size?: 'sm' | 'md' | 'lg' } = {
    'data-testid': 'content',
  };
  if (size) contentProps.size = size;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button>Open</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay data-testid="overlay" />
        <Dialog.Content {...contentProps}>
          <Dialog.Title>Test Title</Dialog.Title>
          <Dialog.Description>Test description text.</Dialog.Description>
          <Dialog.Close>
            <button>Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

function openDialog() {
  fireEvent.click(screen.getByRole('button', { name: 'Open' }));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Styled Dialog', () => {
  // -----------------------------------------------------------------------
  // data-fw-* attributes
  // -----------------------------------------------------------------------

  describe('data attributes for CSS targeting', () => {
    it('adds data-fw-dialog-overlay to Overlay', () => {
      render(<DialogHarness defaultOpen />);
      expect(screen.getByTestId('overlay')).toHaveAttribute(
        'data-fw-dialog-overlay',
      );
    });

    it('adds data-fw-dialog-content to Content', () => {
      render(<DialogHarness defaultOpen />);
      expect(screen.getByTestId('content')).toHaveAttribute(
        'data-fw-dialog-content',
      );
    });

    it('adds data-fw-dialog-title to Title', () => {
      render(<DialogHarness defaultOpen />);
      const title = screen.getByText('Test Title');
      expect(title).toHaveAttribute('data-fw-dialog-title');
    });

    it('adds data-fw-dialog-description to Description', () => {
      render(<DialogHarness defaultOpen />);
      const desc = screen.getByText('Test description text.');
      expect(desc).toHaveAttribute('data-fw-dialog-description');
    });
  });

  // -----------------------------------------------------------------------
  // Content size prop
  // -----------------------------------------------------------------------

  describe('content size', () => {
    it('defaults to data-size="md" when size is not provided', () => {
      render(<DialogHarness defaultOpen />);
      expect(screen.getByTestId('content')).toHaveAttribute(
        'data-size',
        'md',
      );
    });

    it('sets data-size="sm" when size="sm"', () => {
      render(<DialogHarness defaultOpen size="sm" />);
      expect(screen.getByTestId('content')).toHaveAttribute(
        'data-size',
        'sm',
      );
    });

    it('sets data-size="lg" when size="lg"', () => {
      render(<DialogHarness defaultOpen size="lg" />);
      expect(screen.getByTestId('content')).toHaveAttribute(
        'data-size',
        'lg',
      );
    });
  });

  // -----------------------------------------------------------------------
  // Primitive behavior preserved
  // -----------------------------------------------------------------------

  describe('primitive behavior passthrough', () => {
    it('preserves role="dialog" on Content', () => {
      render(<DialogHarness defaultOpen />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('preserves aria-modal="true" on Content', () => {
      render(<DialogHarness defaultOpen />);
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-modal',
        'true',
      );
    });

    it('preserves aria-hidden="true" on Overlay', () => {
      render(<DialogHarness defaultOpen />);
      expect(screen.getByTestId('overlay')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });

    it('preserves aria-labelledby linking Title to Content', () => {
      render(<DialogHarness defaultOpen />);
      const dialog = screen.getByRole('dialog');
      const titleId = screen.getByText('Test Title').id;
      expect(dialog).toHaveAttribute('aria-labelledby', titleId);
    });

    it('preserves aria-describedby linking Description to Content', () => {
      render(<DialogHarness defaultOpen />);
      const dialog = screen.getByRole('dialog');
      const descId = screen.getByText('Test description text.').id;
      expect(dialog).toHaveAttribute('aria-describedby', descId);
    });

    it('opens when trigger is clicked', () => {
      render(<DialogHarness />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      openDialog();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes when Escape is pressed', () => {
      render(<DialogHarness defaultOpen />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes when Close button is clicked', () => {
      render(<DialogHarness defaultOpen />);
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Props passthrough
  // -----------------------------------------------------------------------

  describe('prop passthrough', () => {
    it('passes className to Content', () => {
      render(
        <Dialog open onOpenChange={() => {}}>
          <Dialog.Portal>
            <Dialog.Content className="custom-content">
              <Dialog.Title>T</Dialog.Title>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>,
      );
      expect(screen.getByRole('dialog')).toHaveClass('custom-content');
    });

    it('passes data-testid through all sub-components', () => {
      render(<DialogHarness defaultOpen />);
      expect(screen.getByTestId('overlay')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });
});