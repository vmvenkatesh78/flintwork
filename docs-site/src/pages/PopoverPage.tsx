import { useState } from 'react';
import { Button, Popover } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const POPOVER_DOM = `<button
  aria-haspopup="dialog"
  aria-expanded="true"
  aria-controls="popover-1"
  type="button"
>Settings</button>

<div id="popover-1" data-fw-popover-content="">
  <label>Name</label>
  <input type="text" />
  <button type="button">Done</button>
</div>`;

function DemoPopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button variant="secondary">Open Popover</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content style={{ padding: 'var(--fw-spacing-4)', minWidth: 240 }}>
          <div style={{ marginBottom: 'var(--fw-spacing-3)' }}>
            <label style={{ display: 'block', fontSize: 'var(--fw-fontSize-sm)', marginBottom: 'var(--fw-spacing-1)' }}>Display name</label>
            <input type="text" placeholder="Enter name" style={{ width: '100%', padding: 'var(--fw-spacing-2)', border: '1px solid var(--fw-color-border-default)', borderRadius: 'var(--fw-radii-md)', fontSize: 'var(--fw-fontSize-sm)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Popover.Close>
              <Button variant="primary" size="sm">Apply</Button>
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}

export function PopoverPage() {
  return (
    <>
      <div className="page-header">
        <h1>Popover</h1>
        <p>
          Non-modal popup for interactive content. Focus trapped, click outside and
          Escape to dismiss. No overlay, no <code>aria-modal</code>. Use Dialog for modal behavior.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={POPOVER_DOM} />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                No <code>role="dialog"</code>, no <code>aria-modal</code>. Non-modal by design.
              </p>
            </div>
          </div>
          <div className="comparison-panel">
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body">
              <DemoPopover />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                Bordered card with shadow. Focus moves to first input on open.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Accessibility</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Open the popover above and test:
        </p>
        <ul style={{ fontSize: 'var(--fw-fontSize-sm)', color: 'var(--fw-color-text-secondary)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--fw-spacing-2)' }}>
          <li><code>Tab</code> / <code>Shift+Tab</code> cycles within the popover content</li>
          <li><code>Escape</code> closes and returns focus to the trigger</li>
          <li>Clicking outside closes the popover</li>
          <li>Trigger toggles on repeated clicks</li>
          <li>No <code>aria-modal</code> — content behind remains accessible to screen readers</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Sub-components</h2>
        <table className="token-table">
          <thead><tr><th>Component</th><th>Styled layer</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>Popover</code></td><td>Pass-through</td><td>Root context provider</td></tr>
            <tr><td><code>Popover.Trigger</code></td><td>Pass-through</td><td>Toggles popover on click</td></tr>
            <tr><td><code>Popover.Portal</code></td><td>Pass-through</td><td>Renders children in a portal</td></tr>
            <tr><td><code>Popover.Content</code></td><td>data-fw-popover-content</td><td>Non-modal panel with focus trap</td></tr>
            <tr><td><code>Popover.Close</code></td><td>Pass-through</td><td>Closes popover on click</td></tr>
          </tbody>
        </table>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`// Styled
import { Popover } from 'flintwork';
import 'flintwork/styles/popover.css';

// Headless
import { Popover } from 'flintwork/primitives';`} />
      </div>
    </>
  );
}
