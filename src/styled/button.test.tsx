import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { Button } from './button';

describe('Styled Button', () => {
  // -----------------------------------------------------------------------
  // data-fw-button attribute (the styled layer's only addition)
  // -----------------------------------------------------------------------

  it('adds data-fw-button attribute for CSS targeting', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-fw-button');
  });

  // -----------------------------------------------------------------------
  // Props pass through to the headless primitive
  // -----------------------------------------------------------------------

  it('passes variant as data-variant', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'danger');
  });

  it('passes size as data-size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('defaults to variant="primary" and size="md"', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
  });

  it('sets data-loading when loading is true', () => {
    render(<Button loading>Saving...</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-loading');
  });

  it('sets aria-busy when loading', () => {
    render(<Button loading>Saving...</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('renders as a different element with the as prop', () => {
    render(
      <Button as="a" href="/home">
        Home
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/home');
    expect(link).toHaveAttribute('data-fw-button');
  });

  it('sets type="button" by default to prevent form submission', () => {
    render(<Button>Click</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  // -----------------------------------------------------------------------
  // Ref forwarding and className passthrough
  // -----------------------------------------------------------------------

  it('forwards ref to the rendered element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges className with data-fw-button', () => {
    render(<Button className="custom">Styled</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-fw-button');
    expect(button).toHaveClass('custom');
  });

  // -----------------------------------------------------------------------
  // Disabled states
  // -----------------------------------------------------------------------

  it('passes disabled to the native button', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('prevents onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('prevents onClick when loading', () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Loading
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------------------------
  // onClick passes through
  // -----------------------------------------------------------------------

  it('fires onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});