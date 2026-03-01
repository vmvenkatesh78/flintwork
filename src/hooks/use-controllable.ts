import { useState, useCallback, useRef } from 'react';

/**
 * A hook that allows a component to work in both controlled and uncontrolled modes.
 *
 * Controlled mode: The parent owns the state via `value` and `onChange`.
 * Uncontrolled mode: The component manages its own state, initialized with `defaultValue`.
 *
 * The mode is determined by whether `value` is `undefined`. Note: `null`, `false`,
 * and `0` are all valid controlled values — only `undefined` signals uncontrolled mode.
 *
 * Switching between controlled and uncontrolled mode after initial render is not
 * supported and will trigger a dev-mode warning.
 *
 * @param value - The controlled value. Pass `undefined` to use uncontrolled mode.
 * @param defaultValue - The initial value for uncontrolled mode.
 * @param onChange - Optional callback fired when the value changes in either mode.
 * @returns A tuple of `[currentValue, setValue]`, matching the `useState` signature.
 *
 * @example
 * ```tsx
 * // Controlled
 * const [value, setValue] = useControllable(props.open, false, props.onOpenChange);
 *
 * // Uncontrolled
 * const [value, setValue] = useControllable(undefined, false);
 * ```
 */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const isControlled = value !== undefined;
  const isControlledRef = useRef(isControlled);

  if (process.env.NODE_ENV !== 'production') {
    if (isControlledRef.current !== isControlled) {
      const from = isControlledRef.current ? 'controlled' : 'uncontrolled';
      const to = isControlled ? 'controlled' : 'uncontrolled';
      console.warn(
        `[flintwork] A component switched from ${from} to ${to}. ` +
          `This is not supported. Decide between controlled or uncontrolled ` +
          `for the lifetime of the component.`,
      );
    }
  }

  const [internal, setInternal] = useState(defaultValue);

  const currentValue = isControlled ? value : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternal(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [currentValue, setValue];
}