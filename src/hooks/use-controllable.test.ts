import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useControllable } from './use-controllable';

describe('useControllable', () => {
  // ---------------------------------------------------------------
  // Uncontrolled mode
  // ---------------------------------------------------------------

  describe('uncontrolled mode', () => {
    it('uses defaultValue as initial value', () => {
      const { result } = renderHook(() =>
        useControllable(undefined, 'initial'),
      );

      expect(result.current[0]).toBe('initial');
    });

    it('updates internal state when setValue is called', () => {
      const { result } = renderHook(() =>
        useControllable(undefined, false),
      );

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1](true);
      });

      expect(result.current[0]).toBe(true);
    });

    it('fires onChange callback when setValue is called', () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllable(undefined, 'a', onChange),
      );

      act(() => {
        result.current[1]('b');
      });

      expect(onChange).toHaveBeenCalledWith('b');
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('works without onChange callback', () => {
      const { result } = renderHook(() =>
        useControllable(undefined, 0),
      );

      act(() => {
        result.current[1](5);
      });

      expect(result.current[0]).toBe(5);
    });
  });

  // ---------------------------------------------------------------
  // Controlled mode
  // ---------------------------------------------------------------

  describe('controlled mode', () => {
    it('uses the provided value, not defaultValue', () => {
      const { result } = renderHook(() =>
        useControllable('controlled', 'default'),
      );

      expect(result.current[0]).toBe('controlled');
    });

    it('does not update internal state when setValue is called', () => {
      const onChange = vi.fn();
      const { result, rerender } = renderHook(
        ({ value }) => useControllable(value, 'default', onChange),
        { initialProps: { value: 'first' as string | undefined } },
      );

      act(() => {
        result.current[1]('second');
      });

      // Value should still be 'first' because parent controls it
      expect(result.current[0]).toBe('first');
      // But onChange should have been called so parent can update
      expect(onChange).toHaveBeenCalledWith('second');
    });

    it('reflects new value when parent re-renders with updated prop', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useControllable(value, 'default'),
        { initialProps: { value: 'first' as string | undefined } },
      );

      expect(result.current[0]).toBe('first');

      rerender({ value: 'second' });

      expect(result.current[0]).toBe('second');
    });

    it('treats null as a valid controlled value', () => {
      const { result } = renderHook(() =>
        useControllable<string | null>(null, 'default'),
      );

      expect(result.current[0]).toBeNull();
    });

    it('treats false as a valid controlled value', () => {
      const { result } = renderHook(() =>
        useControllable(false, true),
      );

      expect(result.current[0]).toBe(false);
    });

    it('treats 0 as a valid controlled value', () => {
      const { result } = renderHook(() =>
        useControllable(0, 42),
      );

      expect(result.current[0]).toBe(0);
    });
  });

  // ---------------------------------------------------------------
  // Mode switching warning
  // ---------------------------------------------------------------

  describe('mode switching warning', () => {
    it('warns when switching from uncontrolled to controlled', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { rerender } = renderHook(
        ({ value }) => useControllable(value, 'default'),
        { initialProps: { value: undefined as string | undefined } },
      );

      // Switch to controlled
      rerender({ value: 'now controlled' });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('uncontrolled to controlled'),
      );

      warnSpy.mockRestore();
    });

    it('warns when switching from controlled to uncontrolled', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { rerender } = renderHook(
        ({ value }) => useControllable(value, 'default'),
        { initialProps: { value: 'controlled' as string | undefined } },
      );

      // Switch to uncontrolled
      rerender({ value: undefined });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('controlled to uncontrolled'),
      );

      warnSpy.mockRestore();
    });

    it('does not warn when value changes but mode stays controlled', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { rerender } = renderHook(
        ({ value }) => useControllable(value, 'default'),
        { initialProps: { value: 'a' as string | undefined } },
      );

      rerender({ value: 'b' });
      rerender({ value: 'c' });

      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });
});