import { Tabs } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const TABS_DOM = `<div data-fw-tabs-list="" role="tablist" aria-orientation="horizontal">
  <button
    role="tab"
    data-fw-tabs-trigger=""
    data-state="active"
    aria-selected="true"
    tabindex="0"
  >Overview</button>
  <button
    role="tab"
    data-fw-tabs-trigger=""
    data-state="inactive"
    aria-selected="false"
    tabindex="-1"
  >Usage</button>
  <button
    role="tab"
    data-fw-tabs-trigger=""
    data-disabled=""
    aria-selected="false"
    tabindex="-1"
  >Disabled</button>
</div>

<div
  role="tabpanel"
  data-fw-tabs-panel=""
  data-state="active"
  tabindex="0"
  aria-labelledby="..."
>Panel content</div>`;

export function TabsPage() {
  return (
    <>
      <div className="page-header">
        <h1>Tabs</h1>
        <p>
          Roving tabindex navigation with horizontal and vertical orientation.
          Controlled and uncontrolled modes. Compound component API.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={TABS_DOM} />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                ARIA roles, states, and keyboard behavior built in. Your CSS targets data attributes.
              </p>
            </div>
          </div>
          <div className="comparison-panel">
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body">
              <Tabs defaultValue="one">
                <Tabs.List>
                  <Tabs.Trigger value="one">Tab One</Tabs.Trigger>
                  <Tabs.Trigger value="two">Tab Two</Tabs.Trigger>
                  <Tabs.Trigger value="three">Tab Three</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Panel value="one">Content for tab one</Tabs.Panel>
                <Tabs.Panel value="two">Content for tab two</Tabs.Panel>
                <Tabs.Panel value="three">Content for tab three</Tabs.Panel>
              </Tabs>
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                Token-driven active indicator and hover states.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Default</h2>
        <div className="demo-panel">
          <div className="demo-preview" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
                <Tabs.Trigger value="api">API Reference</Tabs.Trigger>
                <Tabs.Trigger value="disabled" disabled>Disabled</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Panel value="overview">
                The overview tab content. Arrow keys navigate between triggers.
              </Tabs.Panel>
              <Tabs.Panel value="usage">
                Usage instructions and examples for the component.
              </Tabs.Panel>
              <Tabs.Panel value="api">
                API reference with props, events, and types.
              </Tabs.Panel>
            </Tabs>
          </div>
          <CodeBlock code={`<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
    <Tabs.Trigger value="api">API Reference</Tabs.Trigger>
    <Tabs.Trigger value="disabled" disabled>Disabled</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="usage">Usage content</Tabs.Panel>
  <Tabs.Panel value="api">API content</Tabs.Panel>
</Tabs>`} />
        </div>
      </div>

      <div className="demo-section">
        <h2>Keyboard Navigation</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Focus any tab trigger above and test:
        </p>
        <ul style={{ fontSize: 'var(--fw-fontSize-sm)', color: 'var(--fw-color-text-secondary)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--fw-spacing-2)' }}>
          <li><code>ArrowRight</code> / <code>ArrowLeft</code> — move between tabs (horizontal)</li>
          <li><code>Home</code> — jump to first tab</li>
          <li><code>End</code> — jump to last tab</li>
          <li>Disabled tabs are skipped during navigation</li>
          <li><code>Tab</code> moves focus into the active panel, not the next trigger</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`// Styled
import { Tabs } from 'flintwork';
import 'flintwork/styles/tabs.css';

// Headless
import { Tabs } from 'flintwork/primitives';`} />
      </div>
    </>
  );
}
