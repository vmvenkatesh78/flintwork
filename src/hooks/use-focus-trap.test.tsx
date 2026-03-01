import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRef, useState } from 'react';
import { getTabbableElements, useFocusTrap } from './use-focus-trap';

// ---------------------------------------------------------------------------
// getTabbableElements
// ---------------------------------------------------------------------------

describe('getTabbableElements', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('finds buttons, inputs, links, textareas, and selects', () => {
    container.innerHTML = `
      <button>Button</button>
      <input type="text" />
      <a href="/link">Link</a>
      <textarea></textarea>
      <select><option>Opt</option></select>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(5);
  });

  it('finds elements with tabindex="0"', () => {
    container.innerHTML = `
      <div tabindex="0">Focusable div</div>
      <span tabindex="0">Focusable span</span>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(2);
  });

  it('excludes elements with tabindex="-1"', () => {
    container.innerHTML = `
      <button>Tabbable</button>
      <div tabindex="-1">Not tabbable</div>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(1);
    expect(result.at(0)?.textContent).toBe('Tabbable');
  });

  it('excludes disabled buttons and inputs', () => {
    container.innerHTML = `
      <button disabled>Disabled btn</button>
      <input disabled type="text" />
      <button>Enabled btn</button>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(1);
    expect(result.at(0)?.textContent).toBe('Enabled btn');
  });

  it('excludes input type="hidden"', () => {
    container.innerHTML = `
      <input type="hidden" />
      <input type="text" />
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(1);
  });

  it('excludes elements with visibility: hidden', () => {
    container.innerHTML = `
      <button style="visibility: hidden">Hidden</button>
      <button>Visible</button>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(1);
    expect(result.at(0)?.textContent).toBe('Visible');
  });

  it('excludes elements inside [inert]', () => {
    container.innerHTML = `
      <div inert>
        <button>Inert button</button>
        <input type="text" />
      </div>
      <button>Active button</button>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(1);
    expect(result.at(0)?.textContent).toBe('Active button');
  });

  it('finds contenteditable elements', () => {
    container.innerHTML = `
      <div contenteditable="true">Editable</div>
      <div contenteditable="false">Not editable</div>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(1);
  });

  it('finds audio and video with controls', () => {
    container.innerHTML = `
      <audio controls></audio>
      <video controls></video>
      <audio></audio>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(2);
  });

  it('excludes <a> without href', () => {
    container.innerHTML = `
      <a href="/real">Real link</a>
      <a>Not a link</a>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(1);
    expect(result.at(0)?.textContent).toBe('Real link');
  });

  it('returns elements in DOM order', () => {
    container.innerHTML = `
      <button>First</button>
      <input type="text" placeholder="Second" />
      <a href="/third">Third</a>
    `;

    const result = getTabbableElements(container);
    expect(result.at(0)?.textContent).toBe('First');
    expect(result.at(1)).toHaveAttribute('placeholder', 'Second');
    expect(result.at(2)?.textContent).toBe('Third');
  });

  it('returns empty array when no tabbable elements exist', () => {
    container.innerHTML = `
      <div>Just text</div>
      <span>More text</span>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(0);
  });

  it('handles elements inside closed details (only summary is tabbable)', () => {
    container.innerHTML = `
      <details>
        <summary>Summary</summary>
        <button>Hidden button</button>
      </details>
    `;

    const result = getTabbableElements(container);
    const tabbableTexts = result.map((el) => el.textContent);
    expect(tabbableTexts).toContain('Summary');
    expect(tabbableTexts).not.toContain('Hidden button');
  });

  it('handles elements inside open details', () => {
    container.innerHTML = `
      <details open>
        <summary>Summary</summary>
        <button>Visible button</button>
      </details>
    `;

    const result = getTabbableElements(container);
    expect(result).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// useFocusTrap
// ---------------------------------------------------------------------------

describe('useFocusTrap', () => {
  /**
   * Helper component that renders a focus trap with configurable content.
   * The trigger button lives outside the trap to test focus restoration.
   */
  function TrapHarness({
    enabled,
    children,
    initialFocusRef,
  }: {
    enabled: boolean;
    children: React.ReactNode;
    initialFocusRef?: React.RefObject<HTMLElement | null>;
  }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const options = initialFocusRef
      ? { enabled, initialFocusRef }
      : { enabled };
    useFocusTrap(containerRef, options);

    return (
      <div>
        <button data-testid="outside-trigger">Outside trigger</button>
        <div ref={containerRef} data-testid="trap-container">
          {children}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------
  // Initial focus placement
  // ---------------------------------------------------------------

  describe('initial focus placement', () => {
    it('focuses the first tabbable element on activation', () => {
      render(
        <TrapHarness enabled>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
        </TrapHarness>,
      );

      expect(document.activeElement).toBe(screen.getByTestId('first'));
    });

    it('focuses [data-autofocus] element if present', () => {
      render(
        <TrapHarness enabled>
          <button data-testid="first">First</button>
          <button data-testid="auto" data-autofocus>
            Auto
          </button>
        </TrapHarness>,
      );

      expect(document.activeElement).toBe(screen.getByTestId('auto'));
    });

    it('focuses initialFocusRef when provided', () => {
      function HarnessWithRef() {
        const ref = useRef<HTMLButtonElement>(null);
        return (
          <TrapHarness enabled initialFocusRef={ref}>
            <button data-testid="first">First</button>
            <button data-testid="target" ref={ref}>
              Target
            </button>
          </TrapHarness>
        );
      }

      render(<HarnessWithRef />);
      expect(document.activeElement).toBe(screen.getByTestId('target'));
    });

    it('focuses container when no tabbable elements exist', () => {
      render(
        <TrapHarness enabled>
          <div>No tabbable content</div>
        </TrapHarness>,
      );

      expect(document.activeElement).toBe(screen.getByTestId('trap-container'));
    });
  });

  // ---------------------------------------------------------------
  // Tab cycling
  // ---------------------------------------------------------------

  describe('Tab cycling', () => {
    it('wraps focus from last to first on Tab', () => {
      render(
        <TrapHarness enabled>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
          <button data-testid="last">Last</button>
        </TrapHarness>,
      );

      // Focus the last element
      screen.getByTestId('last').focus();
      expect(document.activeElement).toBe(screen.getByTestId('last'));

      // Tab should wrap to first
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(document.activeElement).toBe(screen.getByTestId('first'));
    });

    it('wraps focus from first to last on Shift+Tab', () => {
      render(
        <TrapHarness enabled>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
          <button data-testid="last">Last</button>
        </TrapHarness>,
      );

      // Focus should be on first element (initial focus)
      expect(document.activeElement).toBe(screen.getByTestId('first'));

      // Shift+Tab should wrap to last
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(screen.getByTestId('last'));
    });

    it('does not interfere with non-Tab keys', () => {
      render(
        <TrapHarness enabled>
          <button data-testid="btn">Button</button>
        </TrapHarness>,
      );

      // These keys should pass through unaffected
      fireEvent.keyDown(document, { key: 'Escape' });
      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'ArrowDown' });

      // Focus should still be on the button
      expect(document.activeElement).toBe(screen.getByTestId('btn'));
    });

    it('prevents Tab from escaping when there are no tabbable elements', () => {
      render(
        <TrapHarness enabled>
          <div>No buttons here</div>
        </TrapHarness>,
      );

      // Focus is on the container. Tab should be prevented.
      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        cancelable: true,
        bubbles: true,
      });
      const prevented = !document.dispatchEvent(event);
      expect(prevented).toBe(true);
    });
  });

  // ---------------------------------------------------------------
  // Focus restoration
  // ---------------------------------------------------------------

  describe('focus restoration', () => {
    it('restores focus to previously focused element on deactivation', () => {
      function ToggleTrap() {
        const [enabled, setEnabled] = useState(false);
        return (
          <div>
            <button
              data-testid="trigger"
              onClick={() => setEnabled(true)}
            >
              Open
            </button>
            <TrapHarness enabled={enabled}>
              <button data-testid="inside">Inside</button>
              <button
                data-testid="close"
                onClick={() => setEnabled(false)}
              >
                Close
              </button>
            </TrapHarness>
          </div>
        );
      }

      render(<ToggleTrap />);

      // Focus the trigger
      const trigger = screen.getByTestId('trigger');
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      // Activate the trap
      fireEvent.click(trigger);

      // Focus should be inside the trap
      expect(document.activeElement).toBe(screen.getByTestId('inside'));

      // Deactivate the trap
      fireEvent.click(screen.getByTestId('close'));

      // Focus should be restored to the trigger
      expect(document.activeElement).toBe(trigger);
    });
  });

  // ---------------------------------------------------------------
  // focusin guard
  // ---------------------------------------------------------------

  describe('focusin guard', () => {
    it('reclaims focus when it escapes to an element outside the trap', () => {
      render(
        <TrapHarness enabled>
          <button data-testid="inside">Inside</button>
        </TrapHarness>,
      );

      expect(document.activeElement).toBe(screen.getByTestId('inside'));

      // Attempt to focus something outside the trap
      const outsideTrigger = screen.getByTestId('outside-trigger');
      outsideTrigger.focus();

      // The focusin guard should pull focus back inside
      expect(document.activeElement).toBe(screen.getByTestId('inside'));
    });
  });

  // ---------------------------------------------------------------
  // Dynamic content
  // ---------------------------------------------------------------

  describe('dynamic tabbable elements', () => {
    it('queries tabbable elements on each Tab, not cached from activation', () => {
      function DynamicTrap() {
        const [showExtra, setShowExtra] = useState(false);
        return (
          <TrapHarness enabled>
            <button data-testid="first">First</button>
            {showExtra && <button data-testid="dynamic">Dynamic</button>}
            <button
              data-testid="last"
              onClick={() => setShowExtra(true)}
            >
              Add button
            </button>
          </TrapHarness>
        );
      }

      render(<DynamicTrap />);

      // Initially: first, last — Tab from last wraps to first
      screen.getByTestId('last').focus();
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(document.activeElement).toBe(screen.getByTestId('first'));

      // Add a dynamic button
      fireEvent.click(screen.getByTestId('last'));

      // Now: first, dynamic, last — Tab from last still wraps to first
      screen.getByTestId('last').focus();
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(document.activeElement).toBe(screen.getByTestId('first'));
    });
  });

  // ---------------------------------------------------------------
  // Disabled state
  // ---------------------------------------------------------------

  describe('disabled trap', () => {
    it('does not trap focus when enabled is false', () => {
      render(
        <TrapHarness enabled={false}>
          <button data-testid="inside">Inside</button>
        </TrapHarness>,
      );

      // Focus should NOT have moved to the trap
      expect(document.activeElement).not.toBe(screen.getByTestId('inside'));
    });
  });
});