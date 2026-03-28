import { useState, useRef } from 'react';
import { Button, Tooltip } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const TOOLTIP_DOM = `<button
  aria-describedby="tooltip-1"
  type="button"
>Save</button>

<div
  data-fw-tooltip-content=""
  id="tooltip-1"
  role="tooltip"
>Save your changes to disk</div>`;

export function TooltipPage() {
  return (
    <>
      <div className="page-header">
        <h1>Tooltip</h1>
        <p>
          Non-interactive text popup on hover and focus. Shows after a 700ms delay
          on hover, immediately on focus. Dismissable via Escape without moving focus.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={TOOLTIP_DOM} />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                <code>role="tooltip"</code> and <code>aria-describedby</code> link trigger to content.
              </p>
            </div>
          </div>
          <div className="comparison-panel">
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body">
              <Tooltip>
                <Tooltip.Trigger>
                  <Button variant="secondary">Hover or focus me</Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content>Save your changes to disk</Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip>
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                Dark background, light text, subtle shadow. Token-driven.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Default</h2>
        <div className="demo-panel">
          <div className="demo-preview">
            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="primary">Save</Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content>Save your changes</Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>
            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="danger">Delete</Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content>Delete this item permanently</Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip>
          </div>
          <CodeBlock code={`<Tooltip>
  <Tooltip.Trigger>
    <Button variant="primary">Save</Button>
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>Save your changes</Tooltip.Content>
  </Tooltip.Portal>
</Tooltip>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Accessibility</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Hover or Tab to a button above and test:
        </p>
        <ul style={{ fontSize: 'var(--fw-fontSize-sm)', color: 'var(--fw-color-text-secondary)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--fw-spacing-2)' }}>
          <li><code>Hover</code> — tooltip shows after 700ms delay</li>
          <li><code>Focus</code> — tooltip shows immediately (keyboard users)</li>
          <li><code>Escape</code> — hides tooltip without moving focus</li>
          <li>Mouse can move to tooltip content without it disappearing</li>
          <li><code>aria-describedby</code> links trigger to tooltip content</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`// Styled
import { Tooltip } from 'flintwork';
import 'flintwork/styles/tooltip.css';

// Headless
import { Tooltip } from 'flintwork/primitives';`} />
      </div>
    </>
  );
}
