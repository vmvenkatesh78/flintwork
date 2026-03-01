import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useRovingTabIndex } from './use-roving-tabindex';

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

function Tablist({
  orientation = 'horizontal' as const,
  loop = true,
  onActiveChange,
  children,
}: {
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  onActiveChange?: (index: number) => void;
  children: React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const options = onActiveChange
    ? { orientation, loop, onActiveChange }
    : { orientation, loop };
    useRovingTabIndex(ref, options);
    return (
    <div ref={ref} role="tablist" data-testid="tablist">
        {children}
    </div>
);
}

function Tab({
  label,
  active = false,
  disabled = false,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      role="tab"
      tabIndex={active ? 0 : -1}
      data-testid={`tab-${label.toLowerCase()}`}
      {...(disabled ? { 'data-disabled': true, 'aria-disabled': 'true' } : {})}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useRovingTabIndex', () => {
  // ---------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------

  describe('initialization', () => {
    it('ensures one item has tabindex="0" if none do', () => {
      render(
        <Tablist>
          <button role="tab" tabIndex={-1} data-testid="tab-a">A</button>
          <button role="tab" tabIndex={-1} data-testid="tab-b">B</button>
          <button role="tab" tabIndex={-1} data-testid="tab-c">C</button>
        </Tablist>,
      );

      // First item should have been promoted to tabindex="0"
      expect(screen.getByTestId('tab-a')).toHaveAttribute('tabindex', '0');
      expect(screen.getByTestId('tab-b')).toHaveAttribute('tabindex', '-1');
      expect(screen.getByTestId('tab-c')).toHaveAttribute('tabindex', '-1');
    });

    it('preserves existing tabindex="0" item', () => {
      render(
        <Tablist>
          <Tab label="A" />
          <Tab label="B" active />
          <Tab label="C" />
        </Tablist>,
      );

      // B was explicitly active — should stay
      expect(screen.getByTestId('tab-b')).toHaveAttribute('tabindex', '0');
    });
  });

  // ---------------------------------------------------------------
  // Horizontal navigation
  // ---------------------------------------------------------------

  describe('horizontal navigation', () => {
    it('moves focus right with ArrowRight', () => {
      render(
        <Tablist orientation="horizontal">
          <Tab label="A" active />
          <Tab label="B" />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      expect(document.activeElement).toBe(screen.getByTestId('tab-b'));
      expect(screen.getByTestId('tab-b')).toHaveAttribute('tabindex', '0');
      expect(screen.getByTestId('tab-a')).toHaveAttribute('tabindex', '-1');
    });

    it('moves focus left with ArrowLeft', () => {
      render(
        <Tablist orientation="horizontal">
          <Tab label="A" />
          <Tab label="B" active />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-b').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));
      expect(screen.getByTestId('tab-a')).toHaveAttribute('tabindex', '0');
    });

    it('ignores ArrowUp and ArrowDown in horizontal mode', () => {
      render(
        <Tablist orientation="horizontal">
          <Tab label="A" active />
          <Tab label="B" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowDown' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));

      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowUp' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));
    });
  });

  // ---------------------------------------------------------------
  // Vertical navigation
  // ---------------------------------------------------------------

  describe('vertical navigation', () => {
    it('moves focus down with ArrowDown', () => {
      render(
        <Tablist orientation="vertical">
          <Tab label="A" active />
          <Tab label="B" />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowDown' });

      expect(document.activeElement).toBe(screen.getByTestId('tab-b'));
    });

    it('moves focus up with ArrowUp', () => {
      render(
        <Tablist orientation="vertical">
          <Tab label="A" />
          <Tab label="B" active />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-b').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowUp' });

      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));
    });

    it('ignores ArrowLeft and ArrowRight in vertical mode', () => {
      render(
        <Tablist orientation="vertical">
          <Tab label="A" active />
          <Tab label="B" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));

      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));
    });
  });

  // ---------------------------------------------------------------
  // Both orientation
  // ---------------------------------------------------------------

  describe('both orientation', () => {
    it('responds to all four arrow keys', () => {
      render(
        <Tablist orientation="both">
          <Tab label="A" active />
          <Tab label="B" />
          <Tab label="C" />
        </Tablist>,
      );

      const tablist = screen.getByTestId('tablist');

      screen.getByTestId('tab-a').focus();

      fireEvent.keyDown(tablist, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-b'));

      fireEvent.keyDown(tablist, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-c'));

      fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-b'));

      fireEvent.keyDown(tablist, { key: 'ArrowUp' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));
    });
  });

  // ---------------------------------------------------------------
  // Looping
  // ---------------------------------------------------------------

  describe('loop behavior', () => {
    it('wraps from last to first with loop=true', () => {
      render(
        <Tablist loop>
          <Tab label="A" />
          <Tab label="B" />
          <Tab label="C" active />
        </Tablist>,
      );

      screen.getByTestId('tab-c').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));
    });

    it('wraps from first to last with loop=true', () => {
      render(
        <Tablist loop>
          <Tab label="A" active />
          <Tab label="B" />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowLeft' });

      expect(document.activeElement).toBe(screen.getByTestId('tab-c'));
    });

    it('does not wrap with loop=false', () => {
      render(
        <Tablist loop={false}>
          <Tab label="A" />
          <Tab label="B" />
          <Tab label="C" active />
        </Tablist>,
      );

      screen.getByTestId('tab-c').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      // Should stay on C
      expect(document.activeElement).toBe(screen.getByTestId('tab-c'));
      expect(screen.getByTestId('tab-c')).toHaveAttribute('tabindex', '0');
    });

    it('does not wrap backwards with loop=false', () => {
      render(
        <Tablist loop={false}>
          <Tab label="A" active />
          <Tab label="B" />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowLeft' });

      // Should stay on A
      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));
    });
  });

  // ---------------------------------------------------------------
  // Home / End
  // ---------------------------------------------------------------

  describe('Home and End keys', () => {
    it('Home moves focus to first item', () => {
      render(
        <Tablist>
          <Tab label="A" />
          <Tab label="B" />
          <Tab label="C" active />
        </Tablist>,
      );

      screen.getByTestId('tab-c').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'Home' });

      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));
      expect(screen.getByTestId('tab-a')).toHaveAttribute('tabindex', '0');
      expect(screen.getByTestId('tab-c')).toHaveAttribute('tabindex', '-1');
    });

    it('End moves focus to last item', () => {
      render(
        <Tablist>
          <Tab label="A" active />
          <Tab label="B" />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'End' });

      expect(document.activeElement).toBe(screen.getByTestId('tab-c'));
      expect(screen.getByTestId('tab-c')).toHaveAttribute('tabindex', '0');
    });
  });

  // ---------------------------------------------------------------
  // Disabled items
  // ---------------------------------------------------------------

  describe('disabled item handling', () => {
    it('skips items with data-disabled', () => {
      render(
        <Tablist>
          <Tab label="A" active />
          <Tab label="B" disabled />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      // Should skip B and land on C
      expect(document.activeElement).toBe(screen.getByTestId('tab-c'));
    });

    it('skips multiple consecutive disabled items', () => {
      render(
        <Tablist>
          <Tab label="A" active />
          <Tab label="B" disabled />
          <Tab label="C" disabled />
          <Tab label="D" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      expect(document.activeElement).toBe(screen.getByTestId('tab-d'));
    });

    it('does not include disabled items in navigation set', () => {
      render(
        <Tablist loop>
          <Tab label="A" active />
          <Tab label="B" disabled />
          <Tab label="C" />
        </Tablist>,
      );

      // Navigate to C
      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-c'));

      // Loop back should go to A, not B
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));
    });
  });

  // ---------------------------------------------------------------
  // onActiveChange callback
  // ---------------------------------------------------------------

  describe('onActiveChange callback', () => {
    it('fires with the new index on navigation', () => {
      const onChange = vi.fn();

      render(
        <Tablist onActiveChange={onChange}>
          <Tab label="A" active />
          <Tab label="B" />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('fires correct index when disabled items are skipped', () => {
      const onChange = vi.fn();

      render(
        <Tablist onActiveChange={onChange}>
          <Tab label="A" active />
          <Tab label="B" disabled />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      // Index 1 in the non-disabled items array (A=0, C=1)
      expect(onChange).toHaveBeenCalledWith(1);
    });

    it('does not fire when navigation is a no-op', () => {
      const onChange = vi.fn();

      render(
        <Tablist loop={false} onActiveChange={onChange}>
          <Tab label="A" active />
          <Tab label="B" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowLeft' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // Non-navigation keys
  // ---------------------------------------------------------------

  describe('non-navigation keys', () => {
    it('does not interfere with non-arrow keys', () => {
      render(
        <Tablist>
          <Tab label="A" active />
          <Tab label="B" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();

      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'Enter' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));

      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'Tab' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));

      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'Escape' });
      expect(document.activeElement).toBe(screen.getByTestId('tab-a'));
    });
  });

  // ---------------------------------------------------------------
  // tabindex management
  // ---------------------------------------------------------------

  describe('tabindex management', () => {
    it('sets tabindex="0" on focused item and "-1" on all others', () => {
      render(
        <Tablist>
          <Tab label="A" active />
          <Tab label="B" />
          <Tab label="C" />
        </Tablist>,
      );

      screen.getByTestId('tab-a').focus();
      fireEvent.keyDown(screen.getByTestId('tablist'), { key: 'ArrowRight' });

      expect(screen.getByTestId('tab-a')).toHaveAttribute('tabindex', '-1');
      expect(screen.getByTestId('tab-b')).toHaveAttribute('tabindex', '0');
      expect(screen.getByTestId('tab-c')).toHaveAttribute('tabindex', '-1');
    });

    it('preserves tabindex across multiple navigations', () => {
      render(
        <Tablist>
          <Tab label="A" active />
          <Tab label="B" />
          <Tab label="C" />
        </Tablist>,
      );

      const tablist = screen.getByTestId('tablist');
      screen.getByTestId('tab-a').focus();

      // Navigate A → B → C
      fireEvent.keyDown(tablist, { key: 'ArrowRight' });
      fireEvent.keyDown(tablist, { key: 'ArrowRight' });

      expect(screen.getByTestId('tab-a')).toHaveAttribute('tabindex', '-1');
      expect(screen.getByTestId('tab-b')).toHaveAttribute('tabindex', '-1');
      expect(screen.getByTestId('tab-c')).toHaveAttribute('tabindex', '0');
    });
  });
});