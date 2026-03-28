import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select } from './select';

function StyledTestSelect() {
  return (
    <Select defaultValue="red" defaultOpen>
      <Select.Trigger data-testid="trigger">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content data-testid="content">
          <Select.Item value="red" data-testid="item">Red</Select.Item>
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

describe('Styled Select', () => {
  it('renders trigger with data-fw-select-trigger', () => {
    render(<StyledTestSelect />);
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-fw-select-trigger');
  });

  it('renders content with data-fw-select-content', () => {
    render(<StyledTestSelect />);
    expect(screen.getByTestId('content')).toHaveAttribute('data-fw-select-content');
  });

  it('renders item with data-fw-select-item', () => {
    render(<StyledTestSelect />);
    expect(screen.getByTestId('item')).toHaveAttribute('data-fw-select-item');
  });

  it('preserves role="listbox" on content', () => {
    render(<StyledTestSelect />);
    expect(screen.getByTestId('content')).toHaveAttribute('role', 'listbox');
  });

  it('preserves role="option" on item', () => {
    render(<StyledTestSelect />);
    expect(screen.getByTestId('item')).toHaveAttribute('role', 'option');
  });

  it('preserves aria-haspopup="listbox" on trigger', () => {
    render(<StyledTestSelect />);
    expect(screen.getByTestId('trigger')).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('preserves aria-selected on item', () => {
    render(<StyledTestSelect />);
    expect(screen.getByTestId('item')).toHaveAttribute('aria-selected', 'true');
  });
});
