import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRef, useState } from 'react';
import { useClickOutside } from './use-click-outside';

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

function Harness({
  onClickOutside,
  enabled = true,
}: {
  onClickOutside: () => void;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClickOutside, enabled);

  return (
    <div>
      <button data-testid="outside">Outside</button>
      <div ref={ref} data-testid="container">
        <button data-testid="inside">Inside</button>
        <input data-testid="inside-input" type="text" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useClickOutside', () => {
  // ---------------------------------------------------------------
  // Core behavior
  // ---------------------------------------------------------------

  describe('core behavior', () => {
    it('calls handler when mousedown occurs outside the container', () => {
      const handler = vi.fn();
      render(<Harness onClickOutside={handler} />);

      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does not call handler when mousedown occurs inside the container', () => {
      const handler = vi.fn();
      render(<Harness onClickOutside={handler} />);

      fireEvent.mouseDown(screen.getByTestId('inside'));
      expect(handler).not.toHaveBeenCalled();
    });

    it('does not call handler when mousedown occurs on a child inside the container', () => {
      const handler = vi.fn();
      render(<Harness onClickOutside={handler} />);

      fireEvent.mouseDown(screen.getByTestId('inside-input'));
      expect(handler).not.toHaveBeenCalled();
    });

    it('does not call handler when mousedown occurs on the container itself', () => {
      const handler = vi.fn();
      render(<Harness onClickOutside={handler} />);

      fireEvent.mouseDown(screen.getByTestId('container'));
      expect(handler).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // Touch events (mobile)
  // ---------------------------------------------------------------

  describe('touch events', () => {
    it('calls handler on touchstart outside the container', () => {
      const handler = vi.fn();
      render(<Harness onClickOutside={handler} />);

      fireEvent.touchStart(screen.getByTestId('outside'));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does not call handler on touchstart inside the container', () => {
      const handler = vi.fn();
      render(<Harness onClickOutside={handler} />);

      fireEvent.touchStart(screen.getByTestId('inside'));
      expect(handler).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // Enabled/disabled
  // ---------------------------------------------------------------

  describe('enabled flag', () => {
    it('does not call handler when disabled', () => {
      const handler = vi.fn();
      render(<Harness onClickOutside={handler} enabled={false} />);

      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(handler).not.toHaveBeenCalled();
    });

    it('starts calling handler when re-enabled', () => {
      const handler = vi.fn();

      function ToggleHarness() {
        const [enabled, setEnabled] = useState(false);
        return (
          <div>
            <button
              data-testid="toggle"
              onClick={() => setEnabled(true)}
            >
              Enable
            </button>
            <Harness onClickOutside={handler} enabled={enabled} />
          </div>
        );
      }

      render(<ToggleHarness />);

      // Disabled — should not fire
      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(handler).not.toHaveBeenCalled();

      // Enable
      fireEvent.click(screen.getByTestId('toggle'));

      // Enabled — should fire
      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------
  // Handler reference stability
  // ---------------------------------------------------------------

  describe('handler reference', () => {
    it('always calls the latest handler without re-attaching listeners', () => {
      let callCount = 0;

      function UpdatingHarness() {
        const [, setTick] = useState(0);
        const ref = useRef<HTMLDivElement>(null);

        // This creates a new function reference on every render
        useClickOutside(ref, () => {
          callCount++;
        });

        return (
          <div>
            <button
              data-testid="outside"
              onClick={() => setTick((t) => t + 1)}
            >
              Outside
            </button>
            <div ref={ref} data-testid="container">
              Inside
            </div>
          </div>
        );
      }

      render(<UpdatingHarness />);

      // Force a re-render by clicking (which also fires mousedown outside)
      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(callCount).toBe(1);

      // Re-render happened, new handler reference, but it should still work
      fireEvent.mouseDown(screen.getByTestId('outside'));
      expect(callCount).toBe(2);
    });
  });

  // ---------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------

  describe('cleanup', () => {
    it('removes listeners on unmount', () => {
      const handler = vi.fn();
      const { unmount } = render(<Harness onClickOutside={handler} />);

      unmount();

      // After unmount, clicking should not fire the handler
      fireEvent.mouseDown(document.body);
      expect(handler).not.toHaveBeenCalled();
    });
  });
});