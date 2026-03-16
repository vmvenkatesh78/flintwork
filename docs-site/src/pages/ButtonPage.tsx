import { Button } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const BUTTON_DOM = `<button
  data-variant="primary"
  data-size="md"
  data-fw-button=""
  type="button"
>Primary</button>

<button
  data-variant="secondary"
  data-size="md"
  data-fw-button=""
  type="button"
>Secondary</button>

<button
  data-variant="danger"
  data-size="md"
  data-fw-button=""
  type="button"
>Danger</button>

<button
  data-variant="ghost"
  data-size="md"
  data-fw-button=""
  type="button"
>Ghost</button>`;

export function ButtonPage() {
  return (
    <>
      <div className="page-header">
        <h1>Button</h1>
        <p>
          Polymorphic button with four variants, three sizes, loading and disabled states.
          Renders as any element via the <code>as</code> prop.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={BUTTON_DOM} />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                The headless primitive outputs data attributes. Your CSS targets them.
              </p>
            </div>
          </div>
          <div className="comparison-panel">
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body">
              <div style={{ display: 'flex', gap: 'var(--fw-spacing-2)', flexWrap: 'wrap' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                Token-driven CSS targets <code>data-fw-button</code> and <code>data-variant</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Variants</h2>
        <div className="demo-panel">
          <div className="demo-preview">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <CodeBlock code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Sizes</h2>
        <div className="demo-panel">
          <div className="demo-preview">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
          <CodeBlock code={`<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>States</h2>
        <div className="demo-panel">
          <div className="demo-preview">
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
          <CodeBlock code={`<Button variant="primary" disabled>Disabled</Button>
<Button variant="primary" loading>Loading</Button>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Polymorphic</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Render as any element. TypeScript infers props from the <code>as</code> prop.
        </p>
        <div className="demo-panel">
          <div className="demo-preview">
            <Button as="a" href="https://github.com/vmvenkatesh78/flintwork" variant="primary">
              Link Button
            </Button>
          </div>
          <CodeBlock code={`<Button as="a" href="/docs" variant="primary">
  Link Button
</Button>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`// Styled — includes token-driven CSS
import { Button } from 'flintwork';
import 'flintwork/styles/button.css';

// Headless — behavior only, bring your own CSS
import { Button } from 'flintwork/primitives';`} />
      </div>
    </>
  );
}
