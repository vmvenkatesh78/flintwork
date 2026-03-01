import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { Button } from './button';

describe('Button', () => {
  // ---------------------------------------------------------------
  // Default rendering
  // ---------------------------------------------------------------

  describe('default rendering', () => {
    it('renders as a <button> element by default', () => {
      render(<Button>Click me</Button>);
      const el = screen.getByRole('button', { name: 'Click me' });
      expect(el.tagName).toBe('BUTTON');
    });

    it('defaults to type="button" to prevent form submission', () => {
      render(<Button>Click</Button>);
      const el = screen.getByRole('button');
      expect(el).toHaveAttribute('type', 'button');
    });

    it('allows type="submit" when explicitly passed', () => {
      render(<Button type="submit">Submit</Button>);
      const el = screen.getByRole('button');
      expect(el).toHaveAttribute('type', 'submit');
    });

    it('applies data-variant and data-size attributes', () => {
      render(<Button variant="danger" size="lg">Delete</Button>);
      const el = screen.getByRole('button');
      expect(el).toHaveAttribute('data-variant', 'danger');
      expect(el).toHaveAttribute('data-size', 'lg');
    });

    it('defaults to variant="primary" and size="md"', () => {
      render(<Button>Default</Button>);
      const el = screen.getByRole('button');
      expect(el).toHaveAttribute('data-variant', 'primary');
      expect(el).toHaveAttribute('data-size', 'md');
    });

    it('forwards ref to the rendered element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe('Ref test');
    });
  });

  // ---------------------------------------------------------------
  // Polymorphic rendering
  // ---------------------------------------------------------------

  describe('polymorphic as prop', () => {
    it('renders as an <a> when as="a"', () => {
      render(<Button as="a" href="/home">Home</Button>);
      const el = screen.getByRole('link', { name: 'Home' });
      expect(el.tagName).toBe('A');
      expect(el).toHaveAttribute('href', '/home');
    });

    it('does not add role="button" to <a> with href', () => {
      render(<Button as="a" href="/home">Home</Button>);
      const el = screen.getByRole('link');
      expect(el).not.toHaveAttribute('role');
    });

    it('does not add type="button" to non-button elements', () => {
      render(<Button as="a" href="/test">Link</Button>);
      const el = screen.getByRole('link');
      expect(el).not.toHaveAttribute('type');
    });

    it('warns in dev mode when as="a" without href', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(<Button as="a">No href</Button>);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('without an href'),
      );

      warnSpy.mockRestore();
    });

    it('adds role="button" and tabIndex to <a> without href', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(<Button as="a">No href</Button>);

      const el = screen.getByRole('button');
      expect(el.tagName).toBe('A');
      expect(el).toHaveAttribute('tabindex', '0');

      warnSpy.mockRestore();
    });

    it('adds role="button" and tabIndex to non-interactive elements', () => {
      render(<Button as="div">Div button</Button>);
      const el = screen.getByRole('button', { name: 'Div button' });
      expect(el.tagName).toBe('DIV');
      expect(el).toHaveAttribute('tabindex', '0');
    });

    it('renders a custom component passed via as', () => {
      const CustomLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a data-custom="true" {...props} />
      );
      render(<Button as={CustomLink} href="/test">Custom</Button>);
      const el = screen.getByText('Custom');
      expect(el).toHaveAttribute('data-custom', 'true');
      expect(el).toHaveAttribute('href', '/test');
    });
  });

  // ---------------------------------------------------------------
  // Click handling
  // ---------------------------------------------------------------

  describe('click handling', () => {
    it('fires onClick when clicked', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not fire onClick when disabled', () => {
      const onClick = vi.fn();
      render(<Button disabled onClick={onClick}>Disabled</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------

  describe('loading state', () => {
    it('sets aria-busy="true" when loading', () => {
      render(<Button loading>Loading</Button>);
      const el = screen.getByRole('button');
      expect(el).toHaveAttribute('aria-busy', 'true');
    });

    it('sets data-loading when loading', () => {
      render(<Button loading>Loading</Button>);
      const el = screen.getByRole('button');
      expect(el).toHaveAttribute('data-loading');
    });

    it('does not set data-loading when not loading', () => {
      render(<Button>Not loading</Button>);
      const el = screen.getByRole('button');
      expect(el).not.toHaveAttribute('data-loading');
    });

    it('prevents onClick when loading', () => {
      const onClick = vi.fn();
      render(<Button loading onClick={onClick}>Loading</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('remains focusable when loading', () => {
      render(<Button loading>Loading</Button>);
      const el = screen.getByRole('button');
      expect(el).not.toHaveAttribute('disabled');
      el.focus();
      expect(document.activeElement).toBe(el);
    });
  });

  // ---------------------------------------------------------------
  // Disabled states
  // ---------------------------------------------------------------

  describe('disabled state', () => {
    it('sets native disabled attribute on <button>', () => {
      render(<Button disabled>Disabled</Button>);
      const el = screen.getByRole('button');
      expect(el).toBeDisabled();
    });

    it('does not set native disabled on non-button elements', () => {
      render(<Button as="a" href="/test" disabled>Disabled link</Button>);
      const el = screen.getByRole('link');
      expect(el).not.toHaveAttribute('disabled');
    });

    it('prevents onClick on non-button elements when disabled', () => {
      const onClick = vi.fn();
      render(<Button as="div" disabled onClick={onClick}>Disabled div</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('aria-disabled state', () => {
    it('prevents onClick when aria-disabled is true', () => {
      const onClick = vi.fn();
      render(<Button aria-disabled={true} onClick={onClick}>Aria disabled</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('prevents onClick when aria-disabled is "true" (string)', () => {
      const onClick = vi.fn();
      render(<Button aria-disabled="true" onClick={onClick}>Aria disabled</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('remains focusable when aria-disabled', () => {
      render(<Button aria-disabled={true}>Aria disabled</Button>);
      const el = screen.getByRole('button');
      expect(el).not.toHaveAttribute('disabled');
      el.focus();
      expect(document.activeElement).toBe(el);
    });
  });

  // ---------------------------------------------------------------
  // Passthrough props
  // ---------------------------------------------------------------

  describe('prop passthrough', () => {
    it('passes through aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      const el = screen.getByRole('button', { name: 'Close dialog' });
      expect(el).toBeInTheDocument();
    });

    it('passes through data attributes', () => {
      render(<Button data-testid="my-button">Test</Button>);
      expect(screen.getByTestId('my-button')).toBeInTheDocument();
    });

    it('passes through className', () => {
      render(<Button className="custom-class">Styled</Button>);
      const el = screen.getByRole('button');
      expect(el).toHaveClass('custom-class');
    });
  });
});