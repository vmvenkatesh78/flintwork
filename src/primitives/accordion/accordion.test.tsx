import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './index';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function SingleAccordion({
  defaultValue = 'one',
  collapsible = false,
}: {
  defaultValue?: string;
  collapsible?: boolean;
} = {}) {
  return (
    <Accordion type="single" defaultValue={defaultValue} collapsible={collapsible}>
      <Accordion.Item value="one" data-testid="item-one">
        <Accordion.Trigger data-testid="trigger-one">Section One</Accordion.Trigger>
        <Accordion.Content data-testid="content-one">Content one</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two" data-testid="item-two">
        <Accordion.Trigger data-testid="trigger-two">Section Two</Accordion.Trigger>
        <Accordion.Content data-testid="content-two">Content two</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="three" data-testid="item-three">
        <Accordion.Trigger data-testid="trigger-three">Section Three</Accordion.Trigger>
        <Accordion.Content data-testid="content-three">Content three</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

function MultipleAccordion({ defaultValue = ['one'] }: { defaultValue?: string[] } = {}) {
  return (
    <Accordion type="multiple" defaultValue={defaultValue}>
      <Accordion.Item value="one" data-testid="item-one">
        <Accordion.Trigger data-testid="trigger-one">Section One</Accordion.Trigger>
        <Accordion.Content data-testid="content-one">Content one</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two" data-testid="item-two">
        <Accordion.Trigger data-testid="trigger-two">Section Two</Accordion.Trigger>
        <Accordion.Content data-testid="content-two">Content two</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="three" data-testid="item-three">
        <Accordion.Trigger data-testid="trigger-three">Section Three</Accordion.Trigger>
        <Accordion.Content data-testid="content-three">Content three</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('Accordion', () => {
  describe('rendering', () => {
    it('renders all items and triggers', () => {
      render(<SingleAccordion />);

      expect(screen.getByTestId('trigger-one')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-two')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-three')).toBeInTheDocument();
    });

    it('renders only the open content panel', () => {
      render(<SingleAccordion defaultValue="one" />);

      expect(screen.getByTestId('content-one')).toBeInTheDocument();
      expect(screen.queryByTestId('content-two')).not.toBeInTheDocument();
      expect(screen.queryByTestId('content-three')).not.toBeInTheDocument();
    });

    it('renders no content when no default value', () => {
      render(
        <Accordion type="single">
          <Accordion.Item value="one">
            <Accordion.Trigger data-testid="trigger-one">One</Accordion.Trigger>
            <Accordion.Content data-testid="content-one">Content</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      expect(screen.queryByTestId('content-one')).not.toBeInTheDocument();
    });

    it('trigger is inside a heading element', () => {
      render(<SingleAccordion />);

      const trigger = screen.getByTestId('trigger-one');
      expect(trigger.parentElement?.tagName).toBe('H3');
    });
  });

  // -----------------------------------------------------------------------
  // ARIA attributes
  // -----------------------------------------------------------------------

  describe('ARIA attributes', () => {
    it('trigger has aria-expanded reflecting open state', () => {
      render(<SingleAccordion defaultValue="one" />);

      expect(screen.getByTestId('trigger-one')).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTestId('trigger-two')).toHaveAttribute('aria-expanded', 'false');
    });

    it('trigger has aria-controls pointing to content id', () => {
      render(<SingleAccordion defaultValue="one" />);

      const trigger = screen.getByTestId('trigger-one');
      const content = screen.getByTestId('content-one');
      expect(trigger).toHaveAttribute('aria-controls', content.id);
    });

    it('trigger has type="button"', () => {
      render(<SingleAccordion />);

      expect(screen.getByTestId('trigger-one')).toHaveAttribute('type', 'button');
    });

    it('content has role="region"', () => {
      render(<SingleAccordion defaultValue="one" />);

      expect(screen.getByTestId('content-one')).toHaveAttribute('role', 'region');
    });

    it('content has aria-labelledby pointing to trigger id', () => {
      render(<SingleAccordion defaultValue="one" />);

      const trigger = screen.getByTestId('trigger-one');
      const content = screen.getByTestId('content-one');
      expect(content).toHaveAttribute('aria-labelledby', trigger.id);
    });

    it('content has an id for aria-controls', () => {
      render(<SingleAccordion defaultValue="one" />);

      expect(screen.getByTestId('content-one').id).toBeTruthy();
    });

    it('trigger has an id for aria-labelledby', () => {
      render(<SingleAccordion />);

      expect(screen.getByTestId('trigger-one').id).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------------
  // Single mode
  // -----------------------------------------------------------------------

  describe('single mode', () => {
    it('opens an item on click', () => {
      render(<SingleAccordion defaultValue="one" />);

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(screen.queryByTestId('content-one')).not.toBeInTheDocument();
      expect(screen.getByTestId('content-two')).toBeInTheDocument();
    });

    it('closes the open item when another is opened', () => {
      render(<SingleAccordion defaultValue="one" />);

      expect(screen.getByTestId('content-one')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(screen.queryByTestId('content-one')).not.toBeInTheDocument();
      expect(screen.getByTestId('content-two')).toBeInTheDocument();
    });

    it('does not close the open item when clicked (non-collapsible)', () => {
      render(<SingleAccordion defaultValue="one" collapsible={false} />);

      fireEvent.click(screen.getByTestId('trigger-one'));

      // Should remain open
      expect(screen.getByTestId('content-one')).toBeInTheDocument();
    });

    it('closes the open item when clicked (collapsible)', () => {
      render(<SingleAccordion defaultValue="one" collapsible />);

      fireEvent.click(screen.getByTestId('trigger-one'));

      expect(screen.queryByTestId('content-one')).not.toBeInTheDocument();
    });

    it('updates aria-expanded on toggle', () => {
      render(<SingleAccordion defaultValue="one" />);

      expect(screen.getByTestId('trigger-one')).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(screen.getByTestId('trigger-one')).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByTestId('trigger-two')).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // -----------------------------------------------------------------------
  // Multiple mode
  // -----------------------------------------------------------------------

  describe('multiple mode', () => {
    it('opens multiple items', () => {
      render(<MultipleAccordion defaultValue={['one']} />);

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(screen.getByTestId('content-one')).toBeInTheDocument();
      expect(screen.getByTestId('content-two')).toBeInTheDocument();
    });

    it('closes an item without affecting others', () => {
      render(<MultipleAccordion defaultValue={['one', 'two']} />);

      fireEvent.click(screen.getByTestId('trigger-one'));

      expect(screen.queryByTestId('content-one')).not.toBeInTheDocument();
      expect(screen.getByTestId('content-two')).toBeInTheDocument();
    });

    it('can open all items', () => {
      render(<MultipleAccordion defaultValue={[]} />);

      fireEvent.click(screen.getByTestId('trigger-one'));
      fireEvent.click(screen.getByTestId('trigger-two'));
      fireEvent.click(screen.getByTestId('trigger-three'));

      expect(screen.getByTestId('content-one')).toBeInTheDocument();
      expect(screen.getByTestId('content-two')).toBeInTheDocument();
      expect(screen.getByTestId('content-three')).toBeInTheDocument();
    });

    it('can close all items', () => {
      render(<MultipleAccordion defaultValue={['one', 'two', 'three']} />);

      fireEvent.click(screen.getByTestId('trigger-one'));
      fireEvent.click(screen.getByTestId('trigger-two'));
      fireEvent.click(screen.getByTestId('trigger-three'));

      expect(screen.queryByTestId('content-one')).not.toBeInTheDocument();
      expect(screen.queryByTestId('content-two')).not.toBeInTheDocument();
      expect(screen.queryByTestId('content-three')).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Disabled triggers
  // -----------------------------------------------------------------------

  describe('disabled triggers', () => {
    function DisabledAccordion() {
      return (
        <Accordion type="single" defaultValue="one">
          <Accordion.Item value="one">
            <Accordion.Trigger data-testid="trigger-one">One</Accordion.Trigger>
            <Accordion.Content data-testid="content-one">Content one</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="two">
            <Accordion.Trigger data-testid="trigger-two" disabled>Two</Accordion.Trigger>
            <Accordion.Content data-testid="content-two">Content two</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );
    }

    it('click on disabled trigger does not toggle', () => {
      render(<DisabledAccordion />);

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(screen.getByTestId('content-one')).toBeInTheDocument();
      expect(screen.queryByTestId('content-two')).not.toBeInTheDocument();
    });

    it('disabled trigger has aria-disabled and data-disabled', () => {
      render(<DisabledAccordion />);

      expect(screen.getByTestId('trigger-two')).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByTestId('trigger-two')).toHaveAttribute('data-disabled');
    });
  });

  // -----------------------------------------------------------------------
  // data-state
  // -----------------------------------------------------------------------

  describe('data-state', () => {
    it('item has data-state reflecting open/closed', () => {
      render(<SingleAccordion defaultValue="one" />);

      expect(screen.getByTestId('item-one')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('item-two')).toHaveAttribute('data-state', 'closed');
    });

    it('trigger has data-state reflecting open/closed', () => {
      render(<SingleAccordion defaultValue="one" />);

      expect(screen.getByTestId('trigger-one')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('trigger-two')).toHaveAttribute('data-state', 'closed');
    });

    it('data-state updates on toggle', () => {
      render(<SingleAccordion defaultValue="one" />);

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(screen.getByTestId('item-one')).toHaveAttribute('data-state', 'closed');
      expect(screen.getByTestId('item-two')).toHaveAttribute('data-state', 'open');
    });
  });

  // -----------------------------------------------------------------------
  // Controlled mode
  // -----------------------------------------------------------------------

  describe('controlled mode', () => {
    it('respects controlled value in single mode', () => {
      const { rerender } = render(
        <Accordion type="single" value="one" onValueChange={() => {}}>
          <Accordion.Item value="one">
            <Accordion.Trigger>One</Accordion.Trigger>
            <Accordion.Content data-testid="content-one">Content one</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="two">
            <Accordion.Trigger>Two</Accordion.Trigger>
            <Accordion.Content data-testid="content-two">Content two</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      expect(screen.getByTestId('content-one')).toBeInTheDocument();

      rerender(
        <Accordion type="single" value="two" onValueChange={() => {}}>
          <Accordion.Item value="one">
            <Accordion.Trigger>One</Accordion.Trigger>
            <Accordion.Content data-testid="content-one">Content one</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="two">
            <Accordion.Trigger>Two</Accordion.Trigger>
            <Accordion.Content data-testid="content-two">Content two</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      expect(screen.queryByTestId('content-one')).not.toBeInTheDocument();
      expect(screen.getByTestId('content-two')).toBeInTheDocument();
    });

    it('calls onValueChange with string in single mode', () => {
      const onValueChange = vi.fn();

      render(
        <Accordion type="single" value="one" onValueChange={onValueChange}>
          <Accordion.Item value="one">
            <Accordion.Trigger>One</Accordion.Trigger>
            <Accordion.Content>Content</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="two">
            <Accordion.Trigger data-testid="trigger-two">Two</Accordion.Trigger>
            <Accordion.Content>Content</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      fireEvent.click(screen.getByTestId('trigger-two'));
      expect(onValueChange).toHaveBeenCalledWith('two');
    });

    it('calls onValueChange with array in multiple mode', () => {
      const onValueChange = vi.fn();

      render(
        <Accordion type="multiple" value={['one']} onValueChange={onValueChange}>
          <Accordion.Item value="one">
            <Accordion.Trigger>One</Accordion.Trigger>
            <Accordion.Content>Content</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="two">
            <Accordion.Trigger data-testid="trigger-two">Two</Accordion.Trigger>
            <Accordion.Content>Content</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      fireEvent.click(screen.getByTestId('trigger-two'));
      expect(onValueChange).toHaveBeenCalledWith(['one', 'two']);
    });
  });

  // -----------------------------------------------------------------------
  // Trigger preserves child onClick
  // -----------------------------------------------------------------------

  describe('trigger child behavior', () => {
    it('calls custom onClick alongside toggling', () => {
      const customClick = vi.fn();

      render(
        <Accordion type="single" defaultValue="one">
          <Accordion.Item value="two">
            <Accordion.Trigger data-testid="trigger-two" onClick={customClick}>
              Two
            </Accordion.Trigger>
            <Accordion.Content data-testid="content-two">Content</Accordion.Content>
          </Accordion.Item>
        </Accordion>,
      );

      fireEvent.click(screen.getByTestId('trigger-two'));

      expect(customClick).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('content-two')).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Context boundary
  // -----------------------------------------------------------------------

  describe('context boundary', () => {
    it('throws when compound components are used outside Accordion root', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <Accordion.Item value="test">
            <Accordion.Trigger>Test</Accordion.Trigger>
          </Accordion.Item>,
        );
      }).toThrow(
        '[flintwork] Accordion compound components must be used within an <Accordion> root.',
      );

      spy.mockRestore();
    });

    it('throws when Trigger is used outside Item', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <Accordion type="single">
            <Accordion.Trigger>Orphan</Accordion.Trigger>
          </Accordion>,
        );
      }).toThrow(
        '[flintwork] Accordion.Trigger and Accordion.Content must be used within an <Accordion.Item>.',
      );

      spy.mockRestore();
    });
  });
});
