import { forwardRef, useCallback } from 'react';
import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Polymorphic type utilities
// ---------------------------------------------------------------------------

/**
 * Merges a component's own props with the native props of the element
 * specified by `as`. Own props take precedence over native props to
 * prevent type collisions.
 */
type PolymorphicProps<
  T extends ElementType,
  OwnProps,
> = OwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof OwnProps> & {
    as?: T;
  };

// ---------------------------------------------------------------------------
// Button types
// ---------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonOwnProps = {
  /** The HTML element or custom component to render as. Defaults to `'button'`. */
  as?: ElementType;
  /** Visual variant. No styles applied in the headless primitive — consumers
   *  read this from `data-variant` to apply their own styles. */
  variant?: ButtonVariant;
  /** Size token. Exposed as `data-size` for styling. */
  size?: ButtonSize;
  /** When true, sets `aria-busy`, prevents `onClick`, and keeps the element focusable. */
  loading?: boolean;
  /**
   * When true, uses the native `disabled` attribute which removes the
   * element from tab order. For a disabled button that remains focusable
   * (e.g. to show a tooltip explaining why it's disabled), use
   * `aria-disabled` instead.
   */
  disabled?: boolean;
  /** Content inside the button. */
  children?: ReactNode;
};

type ButtonProps<T extends ElementType = 'button'> = PolymorphicProps<
  T,
  ButtonOwnProps
>;

// ---------------------------------------------------------------------------
// forwardRef wrapper that preserves the generic
// ---------------------------------------------------------------------------

/**
 * React.forwardRef erases the generic type parameter, so we cast the
 * result back to a polymorphic component type. This is the standard
 * workaround used by Radix, Chakra, and Mantine.
 */
type ButtonComponent = <T extends ElementType = 'button'>(
  props: ButtonProps<T> & { ref?: React.Ref<Element> },
) => React.ReactElement | null;

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * Headless Button primitive.
 *
 * Renders the correct HTML element with proper accessibility attributes
 * and interaction behavior. No styles — this is the structural layer.
 *
 * @example
 * ```tsx
 * // Default button
 * <Button onClick={save}>Save</Button>
 *
 * // Link that looks like a button
 * <Button as="a" href="/home">Home</Button>
 *
 * // Loading state — stays focusable, prevents clicks
 * <Button loading>Saving...</Button>
 *
 * // Disabled but focusable (for tooltip accessibility)
 * <Button aria-disabled="true">Unavailable</Button>
 * ```
 */
export const Button: ButtonComponent = forwardRef(
  <T extends ElementType = 'button'>(
    props: ButtonProps<T>,
    ref: React.Ref<Element>,
  ) => {
    const {
      as,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      children,
      onClick,
      ...rest
    } = props;

    const Component: React.ElementType = as ?? 'button';
    const isButton = Component === 'button';
    const isAnchor = Component === 'a';

    // Dev-mode: warn if rendering an anchor without href
    if (process.env.NODE_ENV !== 'production') {
      if (isAnchor && !rest.href) {
        console.warn(
          '[flintwork] Button rendered as <a> without an href. ' +
            'An anchor without href is not accessible — it won\'t be ' +
            'focusable or announced as a link. Pass an href or use ' +
            'as="button" instead.',
        );
      }
    }

    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        // Loading, disabled, or aria-disabled: prevent click but keep
        // element focusable (except native disabled which removes from
        // tab order). The disabled check here covers non-button elements
        // like <div> or <a> where the native disabled attribute has no effect.
        if (loading || disabled) {
          event.preventDefault();
          return;
        }

        if (rest['aria-disabled'] === true || rest['aria-disabled'] === 'true') {
          event.preventDefault();
          return;
        }

        (onClick as React.MouseEventHandler)?.(event);
      },
      [loading, disabled, onClick, rest['aria-disabled']],
    );

    // Build the props to pass to the rendered element
    const elementProps: Record<string, unknown> = {
      ...rest,
      ref,
      onClick: handleClick,
      'data-variant': variant,
      'data-size': size,
      'data-loading': loading || undefined,
    };

    // Button-specific defaults
    if (isButton) {
      // Default to type="button" to prevent accidental form submission
      elementProps.type = rest.type ?? 'button';
      elementProps.disabled = disabled;
    }

    // Accessibility attributes
    if (loading) {
      elementProps['aria-busy'] = true;
    }

    // Non-button interactive elements need role="button" only if they
    // don't have their own interactive semantics. <a href="..."> is
    // already interactive. <a> without href or <div> is not.
    if (!isButton && !isAnchor) {
      elementProps.role = 'button';
      elementProps.tabIndex = rest.tabIndex ?? 0;
    }

    // <a> without href needs role and tabIndex to be interactive
    if (isAnchor && !rest.href) {
      elementProps.role = 'button';
      elementProps.tabIndex = rest.tabIndex ?? 0;
    }

    return <Component {...elementProps}>{children}</Component>;
  },
) as unknown as ButtonComponent;