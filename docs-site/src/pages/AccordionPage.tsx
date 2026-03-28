import { Accordion } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const ACCORDION_DOM = `<div data-accordion="">
  <div data-fw-accordion-item="" data-state="open">
    <h3>
      <button
        data-fw-accordion-trigger=""
        type="button"
        aria-expanded="true"
        aria-controls="content-1"
        data-state="open"
      >Personal Info</button>
    </h3>
    <div
      data-fw-accordion-content=""
      id="content-1"
      role="region"
      aria-labelledby="trigger-1"
      data-state="open"
    >Content here</div>
  </div>

  <div data-fw-accordion-item="" data-state="closed">
    <h3>
      <button
        data-fw-accordion-trigger=""
        type="button"
        aria-expanded="false"
        aria-controls="content-2"
        data-state="closed"
      >Address</button>
    </h3>
  </div>
</div>`;

export function AccordionPage() {
  return (
    <>
      <div className="page-header">
        <h1>Accordion</h1>
        <p>
          Vertically stacked disclosure sections. Single mode (one open at a time)
          or multiple mode (any number open). Trigger inside a heading element.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={ACCORDION_DOM} />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                Trigger in <code>&lt;h3&gt;</code>. <code>aria-expanded</code>, <code>aria-controls</code>, <code>role="region"</code>.
              </p>
            </div>
          </div>
          <div className="comparison-panel">
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body">
              <Accordion type="single" defaultValue="item-1">
                <Accordion.Item value="item-1">
                  <Accordion.Trigger>Personal Information</Accordion.Trigger>
                  <Accordion.Content>Name, email, phone number fields.</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="item-2">
                  <Accordion.Trigger>Address</Accordion.Trigger>
                  <Accordion.Content>Street, city, state, zip code fields.</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="item-3">
                  <Accordion.Trigger>Preferences</Accordion.Trigger>
                  <Accordion.Content>Notification and display settings.</Accordion.Content>
                </Accordion.Item>
              </Accordion>
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                Border separators, hover state, focus-visible outline.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Single Mode</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Only one section open at a time. Opening one closes the other.
        </p>
        <div className="demo-panel">
          <div className="demo-preview" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <Accordion type="single" defaultValue="faq-1">
              <Accordion.Item value="faq-1">
                <Accordion.Trigger>What is flintwork?</Accordion.Trigger>
                <Accordion.Content>A headless React component library with token-driven styling.</Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="faq-2">
                <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
                <Accordion.Content>Full WAI-ARIA compliance with keyboard navigation and screen reader support.</Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="faq-3">
                <Accordion.Trigger>Can I use my own styles?</Accordion.Trigger>
                <Accordion.Content>Yes. Import from flintwork/primitives for the headless layer with zero styling.</Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
          <CodeBlock code={`<Accordion type="single" defaultValue="faq-1">
  <Accordion.Item value="faq-1">
    <Accordion.Trigger>What is flintwork?</Accordion.Trigger>
    <Accordion.Content>A headless React component library...</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="faq-2">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>Full WAI-ARIA compliance...</Accordion.Content>
  </Accordion.Item>
</Accordion>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Multiple Mode</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Any number of sections can be open simultaneously.
        </p>
        <div className="demo-panel">
          <div className="demo-preview" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <Accordion type="multiple" defaultValue={['m-1', 'm-2']}>
              <Accordion.Item value="m-1">
                <Accordion.Trigger>Section A</Accordion.Trigger>
                <Accordion.Content>Content for section A. Both sections start open.</Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="m-2">
                <Accordion.Trigger>Section B</Accordion.Trigger>
                <Accordion.Content>Content for section B. Toggle independently.</Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="m-3">
                <Accordion.Trigger>Section C</Accordion.Trigger>
                <Accordion.Content>Content for section C.</Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
          <CodeBlock code={`<Accordion type="multiple" defaultValue={["m-1", "m-2"]}>
  ...
</Accordion>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Sub-components</h2>
        <table className="token-table">
          <thead><tr><th>Component</th><th>Styled layer</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>Accordion</code></td><td>Pass-through</td><td>Root context provider</td></tr>
            <tr><td><code>Accordion.Item</code></td><td>data-fw-accordion-item</td><td>Single section wrapper</td></tr>
            <tr><td><code>Accordion.Trigger</code></td><td>data-fw-accordion-trigger</td><td>Toggle button inside heading</td></tr>
            <tr><td><code>Accordion.Content</code></td><td>data-fw-accordion-content</td><td>Collapsible region</td></tr>
          </tbody>
        </table>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`// Styled
import { Accordion } from 'flintwork';
import 'flintwork/styles/accordion.css';

// Headless
import { Accordion } from 'flintwork/primitives';`} />
      </div>
    </>
  );
}
