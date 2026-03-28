import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './accordion';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function StyledTestAccordion() {
  return (
    <Accordion type="single" defaultValue="one">
      <Accordion.Item value="one" data-testid="item">
        <Accordion.Trigger data-testid="trigger">Section</Accordion.Trigger>
        <Accordion.Content data-testid="content">Content</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Styled Accordion', () => {
  it('renders item with data-fw-accordion-item attribute', () => {
    render(<StyledTestAccordion />);

    expect(screen.getByTestId('item')).toHaveAttribute('data-fw-accordion-item');
  });

  it('renders trigger with data-fw-accordion-trigger attribute', () => {
    render(<StyledTestAccordion />);

    expect(screen.getByTestId('trigger')).toHaveAttribute('data-fw-accordion-trigger');
  });

  it('renders content with data-fw-accordion-content attribute', () => {
    render(<StyledTestAccordion />);

    expect(screen.getByTestId('content')).toHaveAttribute('data-fw-accordion-content');
  });

  it('preserves aria-expanded from primitive', () => {
    render(<StyledTestAccordion />);

    expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');
  });

  it('preserves role="region" on content from primitive', () => {
    render(<StyledTestAccordion />);

    expect(screen.getByTestId('content')).toHaveAttribute('role', 'region');
  });

  it('preserves aria-controls and aria-labelledby linkage', () => {
    render(<StyledTestAccordion />);

    const trigger = screen.getByTestId('trigger');
    const content = screen.getByTestId('content');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(content).toHaveAttribute('aria-labelledby', trigger.id);
  });
});
