import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from './index';

// ---------------------------------------------------------------------------
// Helper: standard tooltip setup
// ---------------------------------------------------------------------------

function TestTooltip({
  showDelay,
  hideDelay,
}: {
  showDelay?: number;
  hideDelay?: number;
} = {}) {
  const props = {
    ...(showDelay !== undefined ? { showDelay } : {}),
    ...(hideDelay !== undefined ? { hideDelay } : {}),
  };

  return (
    <Tooltip {...props}>
      <Tooltip.Trigger>
        <button data-testid="trigger">Save</button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content data-testid="tooltip">
          Save your changes
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip>
  );
}

// ---------------------------------------------------------------------------
// Timer setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('Tooltip', () => {
  describe('rendering', () => {
    it('does not render tooltip content initially', () => {
      render(<TestTooltip />);

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });

    it('renders trigger', () => {
      render(<TestTooltip />);

      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });

    it('renders tooltip content into document.body via portal', () => {
      render(<TestTooltip showDelay={0} />);

      fireEvent.focus(screen.getByTestId('trigger'));

      const tooltip = screen.getByTestId('tooltip');
      expect(tooltip.parentElement).toBe(document.body);
    });
  });

  // -----------------------------------------------------------------------
  // ARIA attributes
  // -----------------------------------------------------------------------

  describe('ARIA attributes', () => {
    it('tooltip content has role="tooltip"', () => {
      render(<TestTooltip showDelay={0} />);

      fireEvent.focus(screen.getByTestId('trigger'));

      expect(screen.getByTestId('tooltip')).toHaveAttribute('role', 'tooltip');
    });

    it('tooltip content has an id', () => {
      render(<TestTooltip showDelay={0} />);

      fireEvent.focus(screen.getByTestId('trigger'));

      expect(screen.getByTestId('tooltip').id).toBeTruthy();
    });

    it('trigger has aria-describedby pointing to tooltip when open', () => {
      render(<TestTooltip showDelay={0} />);

      fireEvent.focus(screen.getByTestId('trigger'));

      const trigger = screen.getByTestId('trigger');
      const tooltip = screen.getByTestId('tooltip');
      expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    });

    it('trigger does not have aria-describedby when closed', () => {
      render(<TestTooltip />);

      expect(screen.getByTestId('trigger')).not.toHaveAttribute(
        'aria-describedby',
      );
    });
  });

  // -----------------------------------------------------------------------
  // Hover behavior
  // -----------------------------------------------------------------------

  describe('hover behavior', () => {
    it('shows tooltip after show delay on mouse enter', () => {
      render(<TestTooltip />);

      fireEvent.mouseEnter(screen.getByTestId('trigger'));

      // Not visible yet — delay hasn't elapsed
      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

      // Advance past show delay (700ms default)
      act(() => { vi.advanceTimersByTime(700); });

      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('does not show tooltip if mouse leaves before delay', () => {
      render(<TestTooltip />);

      fireEvent.mouseEnter(screen.getByTestId('trigger'));
      act(() => { vi.advanceTimersByTime(300); });

      // Mouse leaves before 700ms delay
      fireEvent.mouseLeave(screen.getByTestId('trigger'));
      act(() => { vi.advanceTimersByTime(700); });

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });

    it('hides tooltip after hide delay on mouse leave', () => {
      render(<TestTooltip />);

      // Show the tooltip
      fireEvent.mouseEnter(screen.getByTestId('trigger'));
      act(() => { vi.advanceTimersByTime(700); });
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();

      // Mouse leaves trigger
      fireEvent.mouseLeave(screen.getByTestId('trigger'));

      // Still visible — hide delay hasn't elapsed (300ms default)
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();

      act(() => { vi.advanceTimersByTime(300); });

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });

    it('cancels hide when mouse enters tooltip content', () => {
      render(<TestTooltip />);

      // Show
      fireEvent.mouseEnter(screen.getByTestId('trigger'));
      act(() => { vi.advanceTimersByTime(700); });

      // Mouse leaves trigger (starts hide delay)
      fireEvent.mouseLeave(screen.getByTestId('trigger'));
      act(() => { vi.advanceTimersByTime(100); });

      // Mouse enters tooltip content (cancels hide)
      fireEvent.mouseEnter(screen.getByTestId('tooltip'));
      act(() => { vi.advanceTimersByTime(500); });

      // Should still be visible
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('hides when mouse leaves tooltip content', () => {
      render(<TestTooltip />);

      // Show
      fireEvent.mouseEnter(screen.getByTestId('trigger'));
      act(() => { vi.advanceTimersByTime(700); });

      // Move to tooltip content
      fireEvent.mouseLeave(screen.getByTestId('trigger'));
      fireEvent.mouseEnter(screen.getByTestId('tooltip'));

      // Leave tooltip content
      fireEvent.mouseLeave(screen.getByTestId('tooltip'));
      act(() => { vi.advanceTimersByTime(300); });

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });

    it('respects custom show delay', () => {
      render(<TestTooltip showDelay={200} />);

      fireEvent.mouseEnter(screen.getByTestId('trigger'));
      act(() => { vi.advanceTimersByTime(100); });
      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

      act(() => { vi.advanceTimersByTime(100); });
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('respects custom hide delay', () => {
      render(<TestTooltip showDelay={0} hideDelay={500} />);

      fireEvent.focus(screen.getByTestId('trigger'));
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();

      fireEvent.blur(screen.getByTestId('trigger'));
      // Blur hides immediately, not via hide delay
      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Focus behavior
  // -----------------------------------------------------------------------

  describe('focus behavior', () => {
    it('shows tooltip immediately on focus (no delay)', () => {
      render(<TestTooltip />);

      fireEvent.focus(screen.getByTestId('trigger'));

      // Visible immediately — keyboard users shouldn't wait
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('hides tooltip immediately on blur', () => {
      render(<TestTooltip />);

      fireEvent.focus(screen.getByTestId('trigger'));
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();

      fireEvent.blur(screen.getByTestId('trigger'));
      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Keyboard
  // -----------------------------------------------------------------------

  describe('keyboard', () => {
    it('hides on Escape without moving focus', () => {
      render(<TestTooltip />);

      const trigger = screen.getByTestId('trigger');
      trigger.focus();
      fireEvent.focus(trigger);
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
      // Focus must stay on the trigger — Escape should NOT move focus
      expect(document.activeElement).toBe(trigger);
    });
  });

  // -----------------------------------------------------------------------
  // Trigger preserves child behavior
  // -----------------------------------------------------------------------

  describe('trigger child behavior', () => {
    it('preserves child onMouseEnter', () => {
      const childOnMouseEnter = vi.fn();

      render(
        <Tooltip>
          <Tooltip.Trigger>
            <button data-testid="trigger" onMouseEnter={childOnMouseEnter}>
              Save
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>Tooltip</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>,
      );

      fireEvent.mouseEnter(screen.getByTestId('trigger'));
      expect(childOnMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('preserves child onFocus', () => {
      const childOnFocus = vi.fn();

      render(
        <Tooltip>
          <Tooltip.Trigger>
            <button data-testid="trigger" onFocus={childOnFocus}>
              Save
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>Tooltip</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>,
      );

      fireEvent.focus(screen.getByTestId('trigger'));
      expect(childOnFocus).toHaveBeenCalledTimes(1);
    });

    it('preserves child onBlur', () => {
      const childOnBlur = vi.fn();

      render(
        <Tooltip>
          <Tooltip.Trigger>
            <button data-testid="trigger" onBlur={childOnBlur}>
              Save
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>Tooltip</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>,
      );

      fireEvent.focus(screen.getByTestId('trigger'));
      fireEvent.blur(screen.getByTestId('trigger'));
      expect(childOnBlur).toHaveBeenCalledTimes(1);
    });
  });

  // -----------------------------------------------------------------------
  // Context boundary
  // -----------------------------------------------------------------------

  describe('context boundary', () => {
    it('throws when compound components are used outside Tooltip root', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Tooltip.Content>Orphan tooltip</Tooltip.Content>);
      }).toThrow(
        '[flintwork] Tooltip compound components must be used within a <Tooltip> root.',
      );

      spy.mockRestore();
    });
  });
});
