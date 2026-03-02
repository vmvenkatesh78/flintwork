import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { Tabs } from './index';

// ---------------------------------------------------------------------------
// Helper: standard three-tab setup
// ---------------------------------------------------------------------------

function TestTabs({
  defaultValue = 'one',
  orientation,
}: {
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
}) {
  const props = orientation
    ? { defaultValue, orientation }
    : { defaultValue };

  return (
    <Tabs {...props}>
      <Tabs.List data-testid="tablist">
        <Tabs.Trigger value="one" data-testid="trigger-one">
          One
        </Tabs.Trigger>
        <Tabs.Trigger value="two" data-testid="trigger-two">
          Two
        </Tabs.Trigger>
        <Tabs.Trigger value="three" data-testid="trigger-three">
          Three
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Panel value="one" data-testid="panel-one">
        Panel one content
      </Tabs.Panel>
      <Tabs.Panel value="two" data-testid="panel-two">
        Panel two content
      </Tabs.Panel>
      <Tabs.Panel value="three" data-testid="panel-three">
        Panel three content
      </Tabs.Panel>
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('Tabs', () => {
  describe('rendering', () => {
    it('renders the tablist and triggers', () => {
      render(<TestTabs />);

      expect(screen.getByTestId('tablist')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-one')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-two')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-three')).toBeInTheDocument();
    });

    it('renders only the selected panel', () => {
      render(<TestTabs defaultValue="two" />);

      expect(screen.queryByTestId('panel-one')).not.toBeInTheDocument();
      expect(screen.getByTestId('panel-two')).toBeInTheDocument();
      expect(screen.queryByTestId('panel-three')).not.toBeInTheDocument();
    });

    it('renders the first tab panel by default', () => {
      render(<TestTabs />);

      expect(screen.getByTestId('panel-one')).toBeInTheDocument();
      expect(screen.queryByTestId('panel-two')).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // ARIA attributes
  // -----------------------------------------------------------------------

  describe('ARIA attributes', () => {
    it('tablist has role="tablist"', () => {
      render(<TestTabs />);
      expect(screen.getByTestId('tablist')).toHaveAttribute('role', 'tablist');
    });

    it('tablist has aria-orientation', () => {
      render(<TestTabs />);
      expect(screen.getByTestId('tablist')).toHaveAttribute(
        'aria-orientation',
        'horizontal',
      );
    });

    it('tablist has aria-orientation="vertical" when vertical', () => {
      render(<TestTabs orientation="vertical" />);
      expect(screen.getByTestId('tablist')).toHaveAttribute(
        'aria-orientation',
        'vertical',
      );
    });

    it('triggers have role="tab"', () => {
      render(<TestTabs />);
      expect(screen.getByTestId('trigger-one')).toHaveAttribute('role', 'tab');
    });

    it('selected trigger has aria-selected="true"', () => {
      render(<TestTabs defaultValue="one" />);

      expect(screen.getByTestId('trigger-one')).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(screen.getByTestId('trigger-two')).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });

    it('selected trigger has tabindex="0", others have "-1"', () => {
      render(<TestTabs defaultValue="two" />);

      expect(screen.getByTestId('trigger-one')).toHaveAttribute('tabindex', '-1');
      expect(screen.getByTestId('trigger-two')).toHaveAttribute('tabindex', '0');
      expect(screen.getByTestId('trigger-three')).toHaveAttribute('tabindex', '-1');
    });

    it('trigger aria-controls points to matching panel id', () => {
      render(<TestTabs />);

      const trigger = screen.getByTestId('trigger-one');
      const panel = screen.getByTestId('panel-one');
      expect(trigger).toHaveAttribute('aria-controls', panel.id);
    });

    it('panel has role="tabpanel"', () => {
      render(<TestTabs />);
      expect(screen.getByTestId('panel-one')).toHaveAttribute('role', 'tabpanel');
    });

    it('panel aria-labelledby points to matching trigger id', () => {
      render(<TestTabs />);

      const trigger = screen.getByTestId('trigger-one');
      const panel = screen.getByTestId('panel-one');
      expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
    });

    it('panel has tabindex="0" for keyboard access', () => {
      render(<TestTabs />);
      expect(screen.getByTestId('panel-one')).toHaveAttribute('tabindex', '0');
    });

    it('triggers have type="button"', () => {
      render(<TestTabs />);
      expect(screen.getByTestId('trigger-one')).toHaveAttribute('type', 'button');
    });
  });

  // -----------------------------------------------------------------------
  // Click selection
  // -----------------------------------------------------------------------

  describe('click selection', () => {
    it('selects a tab on click', () => {
      render(<TestTabs />);

      expect(screen.getByTestId('panel-one')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(screen.queryByTestId('panel-one')).not.toBeInTheDocument();
      expect(screen.getByTestId('panel-two')).toBeInTheDocument();
    });

    it('updates aria-selected on click', () => {
      render(<TestTabs />);

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(screen.getByTestId('trigger-one')).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(screen.getByTestId('trigger-two')).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('updates tabindex on click', () => {
      render(<TestTabs />);

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(screen.getByTestId('trigger-one')).toHaveAttribute('tabindex', '-1');
      expect(screen.getByTestId('trigger-two')).toHaveAttribute('tabindex', '0');
    });
  });

  // -----------------------------------------------------------------------
  // Keyboard navigation (horizontal)
  // -----------------------------------------------------------------------

  describe('horizontal keyboard navigation', () => {
    it('ArrowRight moves focus and selects next tab', () => {
      render(<TestTabs />);

      screen.getByTestId('trigger-one').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      expect(document.activeElement).toBe(screen.getByTestId('trigger-two'));
      expect(screen.getByTestId('panel-two')).toBeInTheDocument();
    });

    it('ArrowLeft moves focus and selects previous tab', () => {
      render(<TestTabs defaultValue="two" />);

      screen.getByTestId('trigger-two').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(screen.getByTestId('trigger-one'));
      expect(screen.getByTestId('panel-one')).toBeInTheDocument();
    });

    it('ArrowRight wraps from last to first', () => {
      render(<TestTabs defaultValue="three" />);

      screen.getByTestId('trigger-three').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      expect(document.activeElement).toBe(screen.getByTestId('trigger-one'));
      expect(screen.getByTestId('panel-one')).toBeInTheDocument();
    });

    it('ArrowLeft wraps from first to last', () => {
      render(<TestTabs />);

      screen.getByTestId('trigger-one').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(screen.getByTestId('trigger-three'));
      expect(screen.getByTestId('panel-three')).toBeInTheDocument();
    });

    it('Home selects first tab', () => {
      render(<TestTabs defaultValue="three" />);

      screen.getByTestId('trigger-three').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'Home' });

      expect(document.activeElement).toBe(screen.getByTestId('trigger-one'));
      expect(screen.getByTestId('panel-one')).toBeInTheDocument();
    });

    it('End selects last tab', () => {
      render(<TestTabs />);

      screen.getByTestId('trigger-one').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'End' });

      expect(document.activeElement).toBe(screen.getByTestId('trigger-three'));
      expect(screen.getByTestId('panel-three')).toBeInTheDocument();
    });

    it('ArrowUp and ArrowDown do nothing in horizontal mode', () => {
      render(<TestTabs />);

      screen.getByTestId('trigger-one').focus();

      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowDown' });
      expect(document.activeElement).toBe(screen.getByTestId('trigger-one'));
      expect(screen.getByTestId('panel-one')).toBeInTheDocument();

      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowUp' });
      expect(document.activeElement).toBe(screen.getByTestId('trigger-one'));
    });
  });

  // -----------------------------------------------------------------------
  // Keyboard navigation (vertical)
  // -----------------------------------------------------------------------

  describe('vertical keyboard navigation', () => {
    it('ArrowDown moves focus and selects next tab', () => {
      render(<TestTabs orientation="vertical" />);

      screen.getByTestId('trigger-one').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowDown' });

      expect(document.activeElement).toBe(screen.getByTestId('trigger-two'));
      expect(screen.getByTestId('panel-two')).toBeInTheDocument();
    });

    it('ArrowUp moves focus and selects previous tab', () => {
      render(<TestTabs defaultValue="two" orientation="vertical" />);

      screen.getByTestId('trigger-two').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowUp' });

      expect(document.activeElement).toBe(screen.getByTestId('trigger-one'));
      expect(screen.getByTestId('panel-one')).toBeInTheDocument();
    });

    it('ArrowLeft and ArrowRight do nothing in vertical mode', () => {
      render(<TestTabs orientation="vertical" />);

      screen.getByTestId('trigger-one').focus();

      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });
      expect(document.activeElement).toBe(screen.getByTestId('trigger-one'));

      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(screen.getByTestId('trigger-one'));
    });
  });

  // -----------------------------------------------------------------------
  // Disabled tabs
  // -----------------------------------------------------------------------

  describe('disabled tabs', () => {
    function DisabledTabs() {
      return (
        <Tabs defaultValue="one">
          <Tabs.List data-testid="tablist">
            <Tabs.Trigger value="one" data-testid="trigger-one">One</Tabs.Trigger>
            <Tabs.Trigger value="two" data-testid="trigger-two" disabled>
              Two
            </Tabs.Trigger>
            <Tabs.Trigger value="three" data-testid="trigger-three">
              Three
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="one" data-testid="panel-one">Panel one</Tabs.Panel>
          <Tabs.Panel value="two" data-testid="panel-two">Panel two</Tabs.Panel>
          <Tabs.Panel value="three" data-testid="panel-three">Panel three</Tabs.Panel>
        </Tabs>
      );
    }

    it('arrow key skips disabled tab', () => {
      render(<DisabledTabs />);

      screen.getByTestId('trigger-one').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      // Should skip "two" and land on "three"
      expect(document.activeElement).toBe(screen.getByTestId('trigger-three'));
      expect(screen.getByTestId('panel-three')).toBeInTheDocument();
    });

    it('click on disabled tab does not select it', () => {
      render(<DisabledTabs />);

      fireEvent.click(screen.getByTestId('trigger-two'));

      // Should remain on "one"
      expect(screen.getByTestId('panel-one')).toBeInTheDocument();
      expect(screen.queryByTestId('panel-two')).not.toBeInTheDocument();
    });

    it('disabled trigger has aria-disabled and data-disabled', () => {
      render(<DisabledTabs />);

      expect(screen.getByTestId('trigger-two')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      expect(screen.getByTestId('trigger-two')).toHaveAttribute('data-disabled');
    });
  });

  // -----------------------------------------------------------------------
  // Controlled mode
  // -----------------------------------------------------------------------

  describe('controlled mode', () => {
    it('respects controlled value prop', () => {
      const { rerender } = render(
        <Tabs value="one" onValueChange={() => {}}>
          <Tabs.List>
            <Tabs.Trigger value="one">One</Tabs.Trigger>
            <Tabs.Trigger value="two">Two</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="one" data-testid="panel-one">One</Tabs.Panel>
          <Tabs.Panel value="two" data-testid="panel-two">Two</Tabs.Panel>
        </Tabs>,
      );

      expect(screen.getByTestId('panel-one')).toBeInTheDocument();

      rerender(
        <Tabs value="two" onValueChange={() => {}}>
          <Tabs.List>
            <Tabs.Trigger value="one">One</Tabs.Trigger>
            <Tabs.Trigger value="two">Two</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="one" data-testid="panel-one">One</Tabs.Panel>
          <Tabs.Panel value="two" data-testid="panel-two">Two</Tabs.Panel>
        </Tabs>,
      );

      expect(screen.queryByTestId('panel-one')).not.toBeInTheDocument();
      expect(screen.getByTestId('panel-two')).toBeInTheDocument();
    });

    it('calls onValueChange on click', () => {
      const onValueChange = vi.fn();

      render(
        <Tabs value="one" onValueChange={onValueChange}>
          <Tabs.List>
            <Tabs.Trigger value="one">One</Tabs.Trigger>
            <Tabs.Trigger value="two" data-testid="trigger-two">Two</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="one">One</Tabs.Panel>
          <Tabs.Panel value="two">Two</Tabs.Panel>
        </Tabs>,
      );

      fireEvent.click(screen.getByTestId('trigger-two'));
      expect(onValueChange).toHaveBeenCalledWith('two');
    });

    it('calls onValueChange on arrow key navigation', () => {
      const onValueChange = vi.fn();

      render(
        <Tabs value="one" onValueChange={onValueChange}>
          <Tabs.List data-testid="tablist">
            <Tabs.Trigger value="one" data-testid="trigger-one">One</Tabs.Trigger>
            <Tabs.Trigger value="two">Two</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="one">One</Tabs.Panel>
          <Tabs.Panel value="two">Two</Tabs.Panel>
        </Tabs>,
      );

      screen.getByTestId('trigger-one').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      expect(onValueChange).toHaveBeenCalledWith('two');
    });
  });

  // -----------------------------------------------------------------------
  // Uncontrolled mode
  // -----------------------------------------------------------------------

  describe('uncontrolled mode', () => {
    it('manages selection internally', () => {
      render(<TestTabs />);

      expect(screen.getByTestId('panel-one')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('trigger-two'));
      expect(screen.getByTestId('panel-two')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('trigger-three'));
      expect(screen.getByTestId('panel-three')).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // data-state attribute
  // -----------------------------------------------------------------------

  describe('data-state', () => {
    it('selected trigger has data-state="active"', () => {
      render(<TestTabs />);

      expect(screen.getByTestId('trigger-one')).toHaveAttribute(
        'data-state',
        'active',
      );
      expect(screen.getByTestId('trigger-two')).toHaveAttribute(
        'data-state',
        'inactive',
      );
    });

    it('active panel has data-state="active"', () => {
      render(<TestTabs />);
      expect(screen.getByTestId('panel-one')).toHaveAttribute(
        'data-state',
        'active',
      );
    });

    it('data-state updates on selection change', () => {
      render(<TestTabs />);

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(screen.getByTestId('trigger-one')).toHaveAttribute(
        'data-state',
        'inactive',
      );
      expect(screen.getByTestId('trigger-two')).toHaveAttribute(
        'data-state',
        'active',
      );
    });
  });

  // -----------------------------------------------------------------------
  // Context boundary
  // -----------------------------------------------------------------------

  describe('context boundary', () => {
    it('throws when compound components are used outside Tabs root', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Tabs.Trigger value="test">Test</Tabs.Trigger>);
      }).toThrow(
        '[flintwork] Tabs compound components must be used within a <Tabs> root.',
      );

      spy.mockRestore();
    });
  });

  // -----------------------------------------------------------------------
  // Trigger preserves child onClick
  // -----------------------------------------------------------------------

  describe('trigger child behavior', () => {
    it('calls custom onClick alongside selection', () => {
      const customClick = vi.fn();

      render(
        <Tabs defaultValue="one">
          <Tabs.List>
            <Tabs.Trigger value="one">One</Tabs.Trigger>
            <Tabs.Trigger
              value="two"
              data-testid="trigger-two"
              onClick={customClick}
            >
              Two
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="one">One</Tabs.Panel>
          <Tabs.Panel value="two" data-testid="panel-two">Two</Tabs.Panel>
        </Tabs>,
      );

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(customClick).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('panel-two')).toBeInTheDocument();
    });
  });
});
