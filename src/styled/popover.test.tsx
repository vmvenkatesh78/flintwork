import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Popover } from './popover';

function StyledTestPopover() {
  return (
    <Popover defaultOpen>
      <Popover.Trigger>
        <button data-testid="trigger">Open</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content data-testid="content">
          <button data-testid="inside">Inside</button>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}

describe('Styled Popover', () => {
  it('renders with data-fw-popover-content attribute', () => {
    render(<StyledTestPopover />);

    expect(screen.getByTestId('content')).toHaveAttribute('data-fw-popover-content');
  });

  it('does not add aria-modal (non-modal)', () => {
    render(<StyledTestPopover />);

    expect(screen.getByTestId('content')).not.toHaveAttribute('aria-modal');
  });

  it('preserves aria-haspopup on trigger', () => {
    render(<StyledTestPopover />);

    expect(screen.getByTestId('trigger')).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('preserves aria-controls linkage', () => {
    render(<StyledTestPopover />);

    const trigger = screen.getByTestId('trigger');
    const content = screen.getByTestId('content');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
  });
});
