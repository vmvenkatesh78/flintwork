import { useState, useEffect, useCallback } from 'react';

interface TokenRow {
  name: string;
  value: string;
  tier: string;
}

const TOKEN_GROUPS = {
  'Colors — Global': [
    '--fw-color-blue-500',
    '--fw-color-blue-600',
    '--fw-color-gray-50',
    '--fw-color-gray-100',
    '--fw-color-gray-200',
    '--fw-color-gray-300',
    '--fw-color-gray-400',
    '--fw-color-gray-500',
    '--fw-color-gray-600',
    '--fw-color-gray-700',
    '--fw-color-gray-800',
    '--fw-color-gray-900',
    '--fw-color-red-500',
    '--fw-color-green-500',
    '--fw-color-orange-500',
  ],
  'Colors — Semantic': [
    '--fw-color-text-primary',
    '--fw-color-text-secondary',
    '--fw-color-text-tertiary',
    '--fw-color-bg-primary',
    '--fw-color-bg-secondary',
    '--fw-color-bg-tertiary',
    '--fw-color-border-default',
    '--fw-color-border-strong',
    '--fw-color-interactive-default',
    '--fw-color-interactive-hover',
    '--fw-color-selection-bg',
    '--fw-color-selection-text',
  ],
  'Spacing': [
    '--fw-spacing-1',
    '--fw-spacing-2',
    '--fw-spacing-3',
    '--fw-spacing-4',
    '--fw-spacing-6',
    '--fw-spacing-8',
    '--fw-spacing-12',
  ],
  'Typography': [
    '--fw-fontSize-xs',
    '--fw-fontSize-sm',
    '--fw-fontSize-md',
    '--fw-fontSize-lg',
    '--fw-fontSize-xl',
    '--fw-fontSize-2xl',
  ],
  'Radii': [
    '--fw-radii-sm',
    '--fw-radii-md',
    '--fw-radii-lg',
    '--fw-radii-xl',
  ],
} as const;

function isColorValue(value: string): boolean {
  return value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl');
}

function useComputedTokens(group: readonly string[]): TokenRow[] {
  const [tokens, setTokens] = useState<TokenRow[]>([]);

  const resolve = useCallback(() => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const rows = group.map((name) => ({
      name,
      value: computed.getPropertyValue(name).trim(),
      tier: name.includes('color-text') || name.includes('color-bg') || name.includes('color-border') || name.includes('color-interactive') || name.includes('color-selection')
        ? 'semantic'
        : name.includes('color-')
          ? 'global'
          : 'global',
    }));
    setTokens(rows);
  }, [group]);

  useEffect(() => {
    resolve();
    const observer = new MutationObserver(resolve);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [resolve]);

  return tokens;
}

function TokenTable({ label, tokenNames }: { readonly label: string; readonly tokenNames: readonly string[] }) {
  const tokens = useComputedTokens(tokenNames);

  return (
    <div className="demo-section">
      <h3 style={{ textTransform: 'none', fontSize: 'var(--fw-fontSize-lg)', fontWeight: 'var(--fw-fontWeight-semibold)', color: 'var(--fw-color-text-primary)', letterSpacing: '0', marginBottom: 'var(--fw-spacing-3)' }}>
        {label}
      </h3>
      <table className="token-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}></th>
            <th>Token</th>
            <th>Computed Value</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.name}>
              <td>
                {isColorValue(token.value) && (
                  <span className="token-swatch" style={{ background: token.value }} />
                )}
              </td>
              <td className="token-name">{token.name}</td>
              <td className="token-value">{token.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Tokens() {
  return (
    <>
      <div className="page-header">
        <h1>Design Tokens</h1>
        <p>
          Three-tier token architecture. Global raw values feed semantic intent mappings,
          which feed component-specific bindings. Toggle the theme to see semantic tokens
          remap to different global values.
        </p>
      </div>

      <div className="demo-section">
        <h2>Token Resolution</h2>
        <pre><code>{`Global:     color.blue.500 = #217CF5
Semantic:   color.interactive.default = {color.blue.500}
Component:  button.primary.bg = {color.interactive.default}

→ CSS:  --fw-button-primary-bg: #217CF5
→ In dark mode: --fw-button-primary-bg: #4C97FF`}</code></pre>
      </div>

      <div className="demo-section">
        <h2>Live Token Inspector</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-6)' }}>
          Values read from <code>getComputedStyle</code> in real time. Toggle the theme
          in the sidebar — semantic tokens resolve to different global values instantly.
        </p>

        {Object.entries(TOKEN_GROUPS).map(([label, names]) => (
          <TokenTable key={label} label={label} tokenNames={names} />
        ))}
      </div>
    </>
  );
}
