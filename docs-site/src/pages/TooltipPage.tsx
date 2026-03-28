import { useState } from 'react';
import { Button, Tooltip } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const TOOLTIP_DOM = `<button aria-describedby="tooltip-1" type="button">Save</button>

<div data-fw-tooltip-content="" id="tooltip-1" role="tooltip">
  Save your changes to disk
</div>`;

const tipStyle: React.CSSProperties = { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8, whiteSpace: 'nowrap' };

function InlineTooltip({ label, tip }: { label: string; tip: string }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} style={{ position: 'relative', display: 'inline-block' }}>
      <Tooltip>
        <Tooltip.Trigger>
          <Button variant="secondary">{label}</Button>
        </Tooltip.Trigger>
        {container && (
          <Tooltip.Portal container={container}>
            <Tooltip.Content style={tipStyle}>{tip}</Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip>
    </div>
  );
}

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
            </div>
          </div>
          <div className="comparison-panel" style={{ overflow: 'visible' }}>
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body" style={{ overflow: 'visible', paddingTop: 48 }}>
              <InlineTooltip label="Hover or focus me" tip="Tooltip appears above the trigger" />
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Default</h2>
        <div className="demo-panel" style={{ overflow: 'visible' }}>
          <div className="demo-preview" style={{ overflow: 'visible', gap: 24, paddingTop: 48 }}>
            <InlineTooltip label="Save" tip="Save your changes" />
            <InlineTooltip label="Delete" tip="Delete permanently" />
            <InlineTooltip label="Share" tip="Copy link" />
          </div>
          <CodeBlock code={`<Tooltip>
  <Tooltip.Trigger>
    <Button>Save</Button>
  </Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>Save your changes</Tooltip.Content>
  </Tooltip.Portal>
</Tooltip>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Accessibility</h2>
        <ul className="a11y-list">
          <li><code>Hover</code> shows after 700ms, <code>Focus</code> shows immediately</li>
          <li><code>Escape</code> hides without moving focus</li>
          <li>Mouse can move to tooltip content without dismissal</li>
          <li><code>aria-describedby</code> links trigger to tooltip</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`import { Tooltip } from 'flintwork';
import 'flintwork/styles/tooltip.css';`} />
      </div>
    </>
  );
}
