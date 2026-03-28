import { useState } from 'react';
import { Button, Popover } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const POPOVER_DOM = `<button aria-haspopup="dialog" aria-expanded="true"
  aria-controls="popover-1" type="button">Settings</button>

<div id="popover-1" data-fw-popover-content="">
  <label>Name</label>
  <input type="text" />
  <button type="button">Done</button>
</div>`;

const dropStyle: React.CSSProperties = { position: 'absolute', top: '100%', left: 0, marginTop: 8, zIndex: 50 };

function DemoPopover() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} style={{ position: 'relative', display: 'inline-block' }}>
      <Popover>
        <Popover.Trigger>
          <Button variant="secondary">Open Popover</Button>
        </Popover.Trigger>
        {container && (
          <Popover.Portal container={container}>
            <Popover.Content style={dropStyle}>
              <div style={{ padding: 16, minWidth: 260 }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Display name</label>
                  <input type="text" placeholder="Enter your name" style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--fw-color-border-default)', borderRadius: 6, fontSize: 14, background: 'var(--fw-color-bg-primary)', color: 'var(--fw-color-text-primary)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <Popover.Close><Button variant="secondary" size="sm">Cancel</Button></Popover.Close>
                  <Popover.Close><Button variant="primary" size="sm">Apply</Button></Popover.Close>
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </Popover>
    </div>
  );
}

export function PopoverPage() {
  return (
    <>
      <div className="page-header">
        <h1>Popover</h1>
        <p>
          Non-modal popup for interactive content. Focus trapped, click outside and
          Escape to dismiss. No overlay, no <code>aria-modal</code>.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={POPOVER_DOM} />
            </div>
          </div>
          <div className="comparison-panel" style={{ overflow: 'visible' }}>
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body" style={{ overflow: 'visible', minHeight: 200 }}>
              <DemoPopover />
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Accessibility</h2>
        <ul className="a11y-list">
          <li><code>Tab</code> / <code>Shift+Tab</code> cycles within the popover</li>
          <li><code>Escape</code> closes and returns focus to trigger</li>
          <li>Clicking outside closes the popover</li>
          <li>No <code>aria-modal</code> — non-modal by design</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Sub-components</h2>
        <table className="token-table">
          <thead><tr><th>Component</th><th>Styled layer</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>Popover</code></td><td>Pass-through</td><td>Root provider</td></tr>
            <tr><td><code>Popover.Trigger</code></td><td>Pass-through</td><td>Toggles on click</td></tr>
            <tr><td><code>Popover.Portal</code></td><td>Pass-through</td><td>Portal rendering</td></tr>
            <tr><td><code>Popover.Content</code></td><td>data-fw-popover-content</td><td>Non-modal panel</td></tr>
            <tr><td><code>Popover.Close</code></td><td>Pass-through</td><td>Closes on click</td></tr>
          </tbody>
        </table>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`import { Popover } from 'flintwork';
import 'flintwork/styles/popover.css';`} />
      </div>
    </>
  );
}
