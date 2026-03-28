import { useState } from 'react';
import { Select } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const SELECT_DOM = `<button
  data-fw-select-trigger=""
  aria-haspopup="listbox"
  aria-expanded="true"
  aria-controls="listbox-1"
  type="button"
><span>Red</span></button>

<div
  id="listbox-1"
  data-fw-select-content=""
  role="listbox"
>
  <div role="option" data-fw-select-item=""
    aria-selected="true" data-state="checked"
    tabindex="0">Red</div>
  <div role="option" data-fw-select-item=""
    aria-selected="false" data-state="unchecked"
    tabindex="-1">Green</div>
  <div role="option" data-fw-select-item=""
    aria-selected="false" data-state="unchecked"
    tabindex="-1">Blue</div>
</div>`;

function DemoSelect() {
  const [value, setValue] = useState('');

  return (
    <div>
      <Select value={value} onValueChange={setValue}>
        <Select.Trigger>
          <Select.Value placeholder="Choose a color" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Item value="red">Red</Select.Item>
            <Select.Item value="green">Green</Select.Item>
            <Select.Item value="blue">Blue</Select.Item>
            <Select.Item value="yellow">Yellow</Select.Item>
            <Select.Item value="gray" disabled>Gray (unavailable)</Select.Item>
          </Select.Content>
        </Select.Portal>
      </Select>
      {value && (
        <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-2)' }}>
          Selected: {value}
        </p>
      )}
    </div>
  );
}

export function SelectPage() {
  return (
    <>
      <div className="page-header">
        <h1>Select</h1>
        <p>
          Single-select listbox triggered by a button. Arrow key navigation,
          typeahead search, and automatic value display. Opens with focus on
          the selected item.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={SELECT_DOM} />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                <code>role="listbox"</code>, <code>role="option"</code>, <code>aria-selected</code>.
              </p>
            </div>
          </div>
          <div className="comparison-panel">
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body">
              <DemoSelect />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                Trigger with border, dropdown with shadow, selected item highlight.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Default</h2>
        <div className="demo-panel">
          <div className="demo-preview">
            <Select defaultValue="green">
              <Select.Trigger>
                <Select.Value placeholder="Color" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content>
                  <Select.Item value="red">Red</Select.Item>
                  <Select.Item value="green">Green</Select.Item>
                  <Select.Item value="blue">Blue</Select.Item>
                </Select.Content>
              </Select.Portal>
            </Select>
          </div>
          <CodeBlock code={`<Select defaultValue="green">
  <Select.Trigger>
    <Select.Value placeholder="Color" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Item value="red">Red</Select.Item>
      <Select.Item value="green">Green</Select.Item>
      <Select.Item value="blue">Blue</Select.Item>
    </Select.Content>
  </Select.Portal>
</Select>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Keyboard Navigation</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Click a Select trigger above to open, then test:
        </p>
        <ul style={{ fontSize: 'var(--fw-fontSize-sm)', color: 'var(--fw-color-text-secondary)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--fw-spacing-2)' }}>
          <li><code>ArrowDown</code> / <code>ArrowUp</code> — navigate between options</li>
          <li><code>Home</code> / <code>End</code> — jump to first / last option</li>
          <li><code>Enter</code> / <code>Space</code> — select and close</li>
          <li><code>Escape</code> — close without changing selection</li>
          <li>Type a letter to jump to matching option (typeahead)</li>
          <li>Opens with focus on the currently selected item</li>
          <li>Disabled options are skipped during navigation</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Sub-components</h2>
        <table className="token-table">
          <thead><tr><th>Component</th><th>Styled layer</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>Select</code></td><td>Pass-through</td><td>Root context provider</td></tr>
            <tr><td><code>Select.Trigger</code></td><td>data-fw-select-trigger</td><td>Button that opens listbox</td></tr>
            <tr><td><code>Select.Value</code></td><td>Pass-through</td><td>Displays selected text or placeholder</td></tr>
            <tr><td><code>Select.Portal</code></td><td>Pass-through</td><td>Renders children in a portal</td></tr>
            <tr><td><code>Select.Content</code></td><td>data-fw-select-content</td><td>Listbox with roving tabindex</td></tr>
            <tr><td><code>Select.Item</code></td><td>data-fw-select-item</td><td>Option, selects and closes on click</td></tr>
          </tbody>
        </table>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`// Styled
import { Select } from 'flintwork';
import 'flintwork/styles/select.css';

// Headless
import { Select } from 'flintwork/primitives';`} />
      </div>
    </>
  );
}
