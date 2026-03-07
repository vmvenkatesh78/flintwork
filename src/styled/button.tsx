import { forwardRef } from 'react';
import type { ElementType, ComponentPropsWithoutRef } from 'react';
import { Button as ButtonPrimitive } from '../primitives/button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type StyledButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  as?: ElementType;
};

type StyledButtonProps<T extends ElementType = 'button'> =
  StyledButtonOwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof StyledButtonOwnProps> & {
    as?: T;
  };

type StyledButtonComponent = (<T extends ElementType = 'button'>(
  props: StyledButtonProps<T> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & {
  displayName?: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Styled Button.
 *
 * Wraps the headless Button primitive with token-driven CSS. The only
 * addition is `data-fw-button` — the attribute that connects this
 * element to `button.css`. Every prop passes through to the primitive.
 *
 * Requires `flintwork/styles/button.css` (or `flintwork/styles`) to be
 * imported for styles to apply. Without the CSS import, this renders
 * identically to the headless primitive.
 *
 * @example
 * ```tsx
 * import { Button } from 'flintwork';
 * import 'flintwork/styles/button.css';
 *
 * <Button variant="primary" size="md">Save</Button>
 * <Button variant="ghost" size="sm">Cancel</Button>
 * <Button as="a" href="/home" variant="secondary">Home</Button>
 * ```
 */
export const Button: StyledButtonComponent = forwardRef(
  <T extends ElementType = 'button'>(
    props: StyledButtonProps<T>,
    ref: React.Ref<Element>,
  ) => {
    // Spread is safe here — StyledButtonProps is a superset of ButtonProps.
    // The outer generic type validates props at the call site. The cast
    // bridges the two polymorphic types which TypeScript cannot unify
    // through a generic spread with exactOptionalPropertyTypes enabled.
    const primitiveProps = { ...props, ref, 'data-fw-button': '' } as Record<string, unknown>;

    return <ButtonPrimitive {...(primitiveProps as any)} />;
  },
) as unknown as StyledButtonComponent;

Button.displayName = 'Button';