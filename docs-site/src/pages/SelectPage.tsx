import { useState } from 'react';
import { Select } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const SELECT_DOM = `<button data-fw-select-trigger=""
  aria-haspopup="listbox" aria-expanded="true"
  aria-controls="listbox-1" type="button">
  <span>Red</span>
</button>

<div id="listbox-1" data-fw-select-content="" role="listbox">
  <div role="option" data-fw-select-item=""
    aria-selected="true" data-state="checked" tabindex="0">Red</div>
  <div role="option" data-fw-select-item=""
    aria-selected="false" data-state="unchecked" tabindex="-1">Green</div>
  <div role="option" data-fw-select-item=""
    aria-selected="false" data-state="unchecked" tabindex="-1">Blue</div>
</div>`;

const dropStyle: React.CSSProperties = { position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 50, minWidth: '100%' };

function DemoSelect() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} style={{ position: 'relative', display: 'inline-block' }}>
      <Select>
        <Select.Trigger>
          <Select.Value placeholder="Choose a color" />
        </Select.Trigger>
        {container && (
          <Select.Portal container={container}>
            <Select.Content style={dropStyle}>
              <Select.Item value="red">Red</Select.Item>
              <Select.Item value="green">Green</Select.Item>
              <Select.Item value="blue">Blue</Select.Item>
              <Select.Item value="yellow">Yellow</Select.Item>
              <Select.Item value="gray" disabled>Gray (unavailable)</Select.Item>
            </Select.Content>
          </Select.Portal>
        )}
      </Select>
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
          typeahead search. Opens with focus on the selected item.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={SELECT_DOM} />
            </div>
          </div>
          <div className="comparison-panel" style={{ overflow: 'visible' }}>
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body" style={{ overflow: 'visible', minHeight: 240 }}>
              <DemoSelect />
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Keyboard Navigation</h2>
        <ul className="a11y-list">
          <li><code>ArrowDown</code> / <code>ArrowUp</code> navigate options</li>
          <li><code>Home</code> / <code>End</code> jump to first / last</li>
          <li><code>Enter</code> / <code>Space</code> select and close</li>
          <li><code>Escape</code> close without changing selection</li>
          <li>Type a letter for typeahead matching</li>
          <li>Opens with focus on selected item</li>
          <li>Disabled options skipped</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Sub-components</h2>
        <table className="token-table">
          <thead><tr><th>Component</th><th>Styled layer</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>Select</code></td><td>Pass-through</td><td>Root provider</td></tr>
            <tr><td><code>Select.Trigger</code></td><td>data-fw-select-trigger</td><td>Opens listbox</td></tr>
            <tr><td><code>Select.Value</code></td><td>Pass-through</td><td>Shows selected text</td></tr>
            <tr><td><code>Select.Portal</code></td><td>Pass-through</td><td>Portal rendering</td></tr>
            <tr><td><code>Select.Content</code></td><td>data-fw-select-content</td><td>Listbox with roving tabindex</td></tr>
            <tr><td><code>Select.Item</code></td><td>data-fw-select-item</td><td>Option item</td></tr>
          </tbody>
        </table>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`import { Select } from 'flintwork';
import 'flintwork/styles/select.css';`} />
      </div>
    </>
  );
}
