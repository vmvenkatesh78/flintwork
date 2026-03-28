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
                  <Accordion.Content>Name, email, phone number fields would go here.</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="item-2">
                  <Accordion.Trigger>Billing Address</Accordion.Trigger>
                  <Accordion.Content>Street, city, state, and zip code fields.</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="item-3">
                  <Accordion.Trigger>Notification Preferences</Accordion.Trigger>
                  <Accordion.Content>Email, SMS, and push notification settings.</Accordion.Content>
                </Accordion.Item>
              </Accordion>
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
                <Accordion.Content>
                  A headless React component library with a three-tier design token pipeline
                  and full WAI-ARIA compliance. Eight components, 280+ tests, zero runtime CSS.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="faq-2">
                <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
                <Accordion.Content>
                  Every component follows WAI-ARIA Authoring Practices. Focus trapping, roving
                  tabindex, keyboard navigation, screen reader announcements, and proper ARIA
                  attributes are built into the headless layer.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="faq-3">
                <Accordion.Trigger>Can I use my own styles?</Accordion.Trigger>
                <Accordion.Content>
                  Yes. Import from flintwork/primitives for headless components with zero styling.
                  The data attributes on the DOM give you full control over presentation.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
          <CodeBlock code={`<Accordion type="single" defaultValue="faq-1">
  <Accordion.Item value="faq-1">
    <Accordion.Trigger>What is flintwork?</Accordion.Trigger>
    <Accordion.Content>A headless React component library...</Accordion.Content>
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
                <Accordion.Trigger>Design Tokens</Accordion.Trigger>
                <Accordion.Content>Three-tier architecture: global raw values, semantic intent mappings, component-specific bindings.</Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="m-2">
                <Accordion.Trigger>Headless Layer</Accordion.Trigger>
                <Accordion.Content>Behavior, state, keyboard interactions, and ARIA. Zero styling. Data attributes for CSS hooks.</Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="m-3">
                <Accordion.Trigger>Styled Layer</Accordion.Trigger>
                <Accordion.Content>One data attribute per component. CSS reads component tokens via intermediate variables.</Accordion.Content>
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
