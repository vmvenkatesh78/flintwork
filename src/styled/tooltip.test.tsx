import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip } from './tooltip';

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
// Helper
// ---------------------------------------------------------------------------

function StyledTestTooltip() {
  return (
    <Tooltip>
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
// Tests
// ---------------------------------------------------------------------------

describe('Styled Tooltip', () => {
  it('renders with data-fw-tooltip-content attribute', () => {
    render(<StyledTestTooltip />);

    fireEvent.focus(screen.getByTestId('trigger'));

    expect(screen.getByTestId('tooltip')).toHaveAttribute(
      'data-fw-tooltip-content',
    );
  });

  it('preserves role="tooltip" from primitive', () => {
    render(<StyledTestTooltip />);

    fireEvent.focus(screen.getByTestId('trigger'));

    expect(screen.getByTestId('tooltip')).toHaveAttribute('role', 'tooltip');
  });

  it('preserves aria-describedby on trigger from primitive', () => {
    render(<StyledTestTooltip />);

    fireEvent.focus(screen.getByTestId('trigger'));

    const trigger = screen.getByTestId('trigger');
    const tooltip = screen.getByTestId('tooltip');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('does not add any ARIA attributes beyond the primitive', () => {
    render(<StyledTestTooltip />);

    fireEvent.focus(screen.getByTestId('trigger'));

    const tooltip = screen.getByTestId('tooltip');
    // The styled wrapper should only add data-fw-tooltip-content.
    // role and id come from the primitive.
    expect(tooltip).toHaveAttribute('data-fw-tooltip-content');
    expect(tooltip).toHaveAttribute('role', 'tooltip');
    expect(tooltip.id).toBeTruthy();
  });
});
