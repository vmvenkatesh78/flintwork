import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Menu } from './menu';

function StyledTestMenu() {
  return (
    <Menu defaultOpen>
      <Menu.Trigger>
        <button data-testid="trigger">Actions</button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content data-testid="content">
          <Menu.Item data-testid="item">Edit</Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}

describe('Styled Menu', () => {
  it('renders content with data-fw-menu-content', () => {
    render(<StyledTestMenu />);
    expect(screen.getByTestId('content')).toHaveAttribute('data-fw-menu-content');
  });

  it('renders item with data-fw-menu-item', () => {
    render(<StyledTestMenu />);
    expect(screen.getByTestId('item')).toHaveAttribute('data-fw-menu-item');
  });

  it('preserves role="menu" on content', () => {
    render(<StyledTestMenu />);
    expect(screen.getByTestId('content')).toHaveAttribute('role', 'menu');
  });

  it('preserves role="menuitem" on item', () => {
    render(<StyledTestMenu />);
    expect(screen.getByTestId('item')).toHaveAttribute('role', 'menuitem');
  });

  it('preserves aria-haspopup="menu" on trigger', () => {
    render(<StyledTestMenu />);
    expect(screen.getByTestId('trigger')).toHaveAttribute('aria-haspopup', 'menu');
  });
});
