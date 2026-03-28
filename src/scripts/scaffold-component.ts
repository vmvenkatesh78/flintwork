#!/usr/bin/env node

/**
 * scaffold-component.ts
 *
 * Generates the full file structure for a new flintwork component.
 * Run: pnpm tsx src/scripts/scaffold-component.ts <name>
 *
 * Creates:
 *   src/primitives/<name>/
 *     <name>-context.ts       — Context + useContext hook
 *     <name>.tsx              — Root compound component (context provider)
 *     <name>.test.tsx         — Test file with describe structure
 *     index.ts                — Compound component assembly + exports
 *
 *   src/styled/
 *     <name>.tsx              — Styled wrapper
 *     <name>.css              — Token-driven CSS (empty scaffold)
 *     <name>.test.tsx         — Styled wrapper tests
 *
 *   src/tokens/component/
 *     <name>.json             — Component token scaffold
 *
 * Does NOT modify existing files (index.ts barrel exports, styled/index.ts,
 * styled/index.css). Those are manual to prevent accidental overwrites.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pascal(s: string): string {
  return s.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
}

function bail(msg: string): never {
  console.error(`\n  Error: ${msg}\n`);
  process.exit(1);
}

function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (fs.existsSync(filePath)) {
    console.log(`  SKIP  ${filePath} (already exists)`);
    return;
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  CREATE ${filePath}`);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const name = process.argv[2];

if (!name) {
  bail('Usage: pnpm tsx src/scripts/scaffold-component.ts <component-name>');
}

if (!/^[a-z][a-z-]*$/.test(name)) {
  bail('Component name must be lowercase with hyphens only (e.g., "tooltip", "select", "accordion").');
}

const Name = pascal(name);
const ROOT = process.cwd();

// Guard against overwriting existing components
if (fs.existsSync(path.join(ROOT, 'src/primitives', name))) {
  bail(`src/primitives/${name}/ already exists.`);
}

console.log(`\nScaffolding ${Name} component...\n`);

// ---------------------------------------------------------------------------
// 1. Primitives — Context
// ---------------------------------------------------------------------------

writeFile(
  path.join(ROOT, `src/primitives/${name}/${name}-context.ts`),
  `import { createContext, useContext } from 'react';

export interface ${Name}ContextValue {
  // TODO: Add shared state for ${Name} compound components
}

export const ${Name}Context = createContext<${Name}ContextValue | null>(null);

/**
 * Returns the ${Name} context. Throws if used outside a ${Name} root.
 */
export function use${Name}Context(): ${Name}ContextValue {
  const context = useContext(${Name}Context);
  if (!context) {
    throw new Error(
      '[flintwork] ${Name} compound components must be used within a <${Name}> root.',
    );
  }
  return context;
}
`,
);

// ---------------------------------------------------------------------------
// 2. Primitives — Root component
// ---------------------------------------------------------------------------

writeFile(
  path.join(ROOT, `src/primitives/${name}/${name}.tsx`),
  `import { useId, useMemo } from 'react';
import { useControllable } from '../../hooks/use-controllable';
import { ${Name}Context } from './${name}-context';
import type { ReactNode } from 'react';

export interface ${Name}Props {
  children: ReactNode;
  // TODO: Add controlled/uncontrolled props
}

/**
 * Root ${Name} component. Provides shared state to all compound children.
 * Renders no DOM element — pure context provider.
 */
export function ${Name}Root({ children }: ${Name}Props) {
  const baseId = useId();

  const context = useMemo(
    () => ({
      // TODO: Build context value
    }),
    [],
  );

  return (
    <${Name}Context.Provider value={context}>
      {children}
    </${Name}Context.Provider>
  );
}
`,
);

// ---------------------------------------------------------------------------
// 3. Primitives — Index (compound assembly)
// ---------------------------------------------------------------------------

writeFile(
  path.join(ROOT, `src/primitives/${name}/index.ts`),
  `import { ${Name}Root } from './${name}';

/**
 * ${Name} compound component.
 *
 * @example
 * \`\`\`tsx
 * <${Name}>
 *   {/* Sub-components here */}
 * </${Name}>
 * \`\`\`
 */
export const ${Name} = Object.assign(${Name}Root, {
  // TODO: Attach sub-components
  // Trigger: ${Name}Trigger,
  // Content: ${Name}Content,
});

export type { ${Name}Props } from './${name}';
`,
);

// ---------------------------------------------------------------------------
// 4. Primitives — Test file
// ---------------------------------------------------------------------------

writeFile(
  path.join(ROOT, `src/primitives/${name}/${name}.test.tsx`),
  `import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { ${Name} } from './index';

// ---------------------------------------------------------------------------
// Helper: standard test setup
// ---------------------------------------------------------------------------

// TODO: Build test helper component

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('${Name}', () => {
  describe('rendering', () => {
    it.todo('renders the component');
  });

  // -----------------------------------------------------------------------
  // ARIA attributes
  // -----------------------------------------------------------------------

  describe('ARIA attributes', () => {
    it.todo('has correct ARIA roles');
    it.todo('has correct ARIA states');
  });

  // -----------------------------------------------------------------------
  // Keyboard navigation
  // -----------------------------------------------------------------------

  describe('keyboard navigation', () => {
    it.todo('supports expected keyboard interactions');
  });

  // -----------------------------------------------------------------------
  // Focus management
  // -----------------------------------------------------------------------

  describe('focus management', () => {
    it.todo('manages focus correctly');
  });

  // -----------------------------------------------------------------------
  // Controlled mode
  // -----------------------------------------------------------------------

  describe('controlled mode', () => {
    it.todo('respects controlled props');
    it.todo('calls onChange callbacks');
  });

  // -----------------------------------------------------------------------
  // Uncontrolled mode
  // -----------------------------------------------------------------------

  describe('uncontrolled mode', () => {
    it.todo('manages internal state');
  });

  // -----------------------------------------------------------------------
  // Context boundary
  // -----------------------------------------------------------------------

  describe('context boundary', () => {
    it('throws when used outside root', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // TODO: Render a sub-component outside root
      // expect(() => {
      //   render(<${Name}.Content />);
      // }).toThrow('[flintwork] ${Name} compound components must be used within a <${Name}> root.');

      spy.mockRestore();
    });
  });
});
`,
);

// ---------------------------------------------------------------------------
// 5. Styled — Component wrapper
// ---------------------------------------------------------------------------

writeFile(
  path.join(ROOT, `src/styled/${name}.tsx`),
  `import type { ComponentPropsWithoutRef } from 'react';
import { ${Name} as ${Name}Primitive } from '../primitives/${name}';
import type { ${Name}Props } from '../primitives/${name}';

// ---------------------------------------------------------------------------
// Sub-components — only wrap the ones that produce styled DOM
// ---------------------------------------------------------------------------

// TODO: Create styled wrappers for sub-components that need data-fw-* attributes
// Example:
// function Styled${Name}Content(props: Readonly<ComponentPropsWithoutRef<'div'>>) {
//   return <${Name}Primitive.Content data-fw-${name}-content="" {...props} />;
// }
// Styled${Name}Content.displayName = '${Name}.Content';

// ---------------------------------------------------------------------------
// Root wrapper
// ---------------------------------------------------------------------------

function Styled${Name}Root(props: Readonly<${Name}Props>) {
  return <${Name}Primitive {...props} />;
}
Styled${Name}Root.displayName = '${Name}';

// ---------------------------------------------------------------------------
// Compound component assembly
// ---------------------------------------------------------------------------

/**
 * Styled ${Name}.
 *
 * Wraps the headless ${Name} primitive with token-driven CSS.
 * Requires \`flintwork/styles/${name}.css\` (or \`flintwork/styles\`) to be
 * imported for styles to apply.
 *
 * @example
 * \`\`\`tsx
 * import { ${Name} } from 'flintwork';
 * import 'flintwork/styles/${name}.css';
 *
 * <${Name}>
 *   {/* Sub-components here */}
 * </${Name}>
 * \`\`\`
 */
export const ${Name} = Object.assign(Styled${Name}Root, {
  // TODO: Attach styled sub-components
});

export type { ${Name}Props } from '../primitives/${name}';
`,
);

// ---------------------------------------------------------------------------
// 6. Styled — CSS scaffold
// ---------------------------------------------------------------------------

writeFile(
  path.join(ROOT, `src/styled/${name}.css`),
  `/* ${Name} — Token-driven styles
 *
 * Targets data-fw-${name}-* attributes added by the styled wrapper.
 * All values reference component tokens from tokens/component/${name}.json.
 *
 * Architecture: CSS reads component tokens (--fw-${name}-*) which reference
 * semantic tokens, which reference global tokens. A single
 * [data-theme="dark"] swap on :root changes every value.
 */

/* TODO: Add CSS rules targeting [data-fw-${name}-*] attributes */
`,
);

// ---------------------------------------------------------------------------
// 7. Styled — Test file
// ---------------------------------------------------------------------------

writeFile(
  path.join(ROOT, `src/styled/${name}.test.tsx`),
  `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// TODO: Import styled ${Name} and test that:
// 1. data-fw-${name}-* attributes are present
// 2. All primitive ARIA attributes pass through unchanged
// 3. Styled wrapper does not alter accessibility behavior

describe('Styled ${Name}', () => {
  it.todo('renders with data-fw-${name} attribute');
  it.todo('preserves all ARIA attributes from primitive');
});
`,
);

// ---------------------------------------------------------------------------
// 8. Component tokens
// ---------------------------------------------------------------------------

writeFile(
  path.join(ROOT, `src/tokens/component/${name}.json`),
  `{
  "${name}": {
  }
}
`,
);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`
Done. Next steps:

  1. Build the primitive sub-components in src/primitives/${name}/
  2. Wire them into the compound component in src/primitives/${name}/index.ts
  3. Add component tokens to src/tokens/component/${name}.json
  4. Build styled wrappers in src/styled/${name}.tsx
  5. Write CSS in src/styled/${name}.css
  6. Write tests (remove .todo markers as you implement)
  7. Export from src/primitives/index.ts:
       export { ${Name} } from './${name}';
  8. Export from src/styled/index.ts:
       export { ${Name} } from './${name}';
  9. Import CSS in src/styled/index.css:
       @import './${name}.css';
  10. Update A11Y_PATTERNS.md with edge cases discovered
`);
