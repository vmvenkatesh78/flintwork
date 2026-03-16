import { useState } from 'react';
import { Button, Dialog } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const DIALOG_DOM = `<div data-fw-dialog-overlay="" data-state="open" />

<div
  data-fw-dialog-content=""
  data-size="md"
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title-1"
  aria-describedby="dialog-desc-1"
  tabindex="-1"
>
  <h2
    data-fw-dialog-title=""
    id="dialog-title-1"
  >Confirm action</h2>

  <p
    data-fw-dialog-description=""
    id="dialog-desc-1"
  >Are you sure you want to proceed?</p>

  <button type="button">Cancel</button>
  <button type="button">Confirm</button>
</div>`;

function DemoDialog({ size, label }: { readonly size: 'sm' | 'md' | 'lg'; readonly label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="secondary">{label}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content size={size}>
          <Dialog.Title>Dialog — {label}</Dialog.Title>
          <Dialog.Description>
            Focus is trapped inside this dialog. Press Tab to cycle through focusable elements.
            Press Escape or click the overlay to close.
          </Dialog.Description>
          <div style={{ display: 'flex', gap: 'var(--fw-spacing-2)', justifyContent: 'flex-end', marginTop: 'var(--fw-spacing-6)' }}>
            <Dialog.Close>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button variant="primary">Confirm</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export function DialogPage() {
  return (
    <>
      <div className="page-header">
        <h1>Dialog</h1>
        <p>
          Modal dialog with focus trapping, Escape dismissal, click-outside handling,
          and automatic focus restoration. Compound component API with portal rendering.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={DIALOG_DOM} />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                ARIA roles, modal semantics, and ID-linked labelling. Focus trap is JS behavior, not visible in DOM.
              </p>
            </div>
          </div>
          <div className="comparison-panel">
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body">
              <DemoDialog size="md" label="Open Styled Dialog" />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                Overlay, content panel, title, and description styled via token CSS.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Sizes</h2>
        <div className="demo-panel">
          <div className="demo-preview">
            <DemoDialog size="sm" label="Small (400px)" />
            <DemoDialog size="md" label="Medium (560px)" />
            <DemoDialog size="lg" label="Large (720px)" />
          </div>
          <CodeBlock code={`<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger>
    <Button variant="secondary">Open</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content size="md">
      <Dialog.Title>Confirm action</Dialog.Title>
      <Dialog.Description>
        Are you sure you want to proceed?
      </Dialog.Description>
      <Dialog.Close>
        <Button variant="primary">Confirm</Button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Accessibility</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Open any dialog above and test these behaviors:
        </p>
        <ul style={{ fontSize: 'var(--fw-fontSize-sm)', color: 'var(--fw-color-text-secondary)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--fw-spacing-2)' }}>
          <li><code>Tab</code> cycles focus within the dialog — it never escapes to the page behind</li>
          <li><code>Shift+Tab</code> cycles backward through focusable elements</li>
          <li><code>Escape</code> closes the dialog and returns focus to the trigger</li>
          <li>Clicking the overlay closes the dialog</li>
          <li><code>role="dialog"</code> and <code>aria-modal="true"</code> are set automatically</li>
          <li><code>aria-labelledby</code> links to the Dialog.Title</li>
          <li><code>aria-describedby</code> links to the Dialog.Description</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Sub-components</h2>
        <table className="token-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Styled layer</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>Dialog</code></td><td>Pass-through</td><td>Root context provider</td></tr>
            <tr><td><code>Dialog.Trigger</code></td><td>Pass-through</td><td>Opens the dialog on click</td></tr>
            <tr><td><code>Dialog.Portal</code></td><td>Pass-through</td><td>Renders children in a portal</td></tr>
            <tr><td><code>Dialog.Overlay</code></td><td>data-fw-dialog-overlay</td><td>Fullscreen backdrop</td></tr>
            <tr><td><code>Dialog.Content</code></td><td>data-fw-dialog-content</td><td>Modal panel with focus trap</td></tr>
            <tr><td><code>Dialog.Title</code></td><td>data-fw-dialog-title</td><td>Accessible heading</td></tr>
            <tr><td><code>Dialog.Description</code></td><td>data-fw-dialog-description</td><td>Accessible description</td></tr>
            <tr><td><code>Dialog.Close</code></td><td>Pass-through</td><td>Closes the dialog on click</td></tr>
          </tbody>
        </table>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`// Styled
import { Dialog } from 'flintwork';
import 'flintwork/styles/dialog.css';

// Headless
import { Dialog } from 'flintwork/primitives';`} />
      </div>
    </>
  );
}
