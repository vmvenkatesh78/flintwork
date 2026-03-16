import { useState } from 'react';
import { Button, Dialog, Tabs } from 'flintwork';

export function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="page-header">
        <h1>flintwork</h1>
        <p>
          Headless React components with token-driven styling. Three-tier design tokens,
          compound component API, full WAI-ARIA compliance. Zero runtime CSS.
        </p>
      </div>

      <div className="demo-section">
        <h2>Kitchen Sink</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Every component rendered together. Toggle the theme to see all tokens update simultaneously.
        </p>

        <div className="demo-panel">
          <div className="demo-preview" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--fw-spacing-6)' }}>

            <div>
              <h3>Button</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--fw-spacing-3)', alignItems: 'center' }}>
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary">Primary</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" loading>Loading</Button>
              </div>
            </div>

            <div>
              <h3>Dialog</h3>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Trigger>
                  <Button variant="secondary">Open Dialog</Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay />
                  <Dialog.Content>
                    <Dialog.Title>Confirm action</Dialog.Title>
                    <Dialog.Description>
                      This dialog traps focus, dismisses on Escape, and returns focus to the trigger on close.
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
            </div>

            <div>
              <h3>Tabs</h3>
              <Tabs defaultValue="overview">
                <Tabs.List>
                  <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                  <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
                  <Tabs.Trigger value="api">API</Tabs.Trigger>
                  <Tabs.Trigger value="disabled" disabled>Disabled</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Panel value="overview">
                  Roving tabindex navigation. Arrow keys move between tabs. Home and End jump to first and last.
                </Tabs.Panel>
                <Tabs.Panel value="usage">
                  Import the styled component and its CSS. The headless primitive handles all keyboard behavior.
                </Tabs.Panel>
                <Tabs.Panel value="api">
                  Compound component API with dot notation. Tabs.List, Tabs.Trigger, Tabs.Panel.
                </Tabs.Panel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Architecture</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Two layers. Pick the one you need.
        </p>

        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">Headless Primitive</div>
            <div className="comparison-panel-body">
              <p style={{ fontSize: 'var(--fw-fontSize-sm)', marginBottom: 'var(--fw-spacing-3)' }}>
                Behavior only. State management, keyboard interactions, focus trapping, ARIA attributes. Zero styling.
              </p>
              <pre><code>{`import { Button } from 'flintwork/primitives';

<Button
  variant="primary"
  onClick={handleSubmit}
>
  Submit
</Button>`}</code></pre>
            </div>
          </div>

          <div className="comparison-panel">
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body">
              <p style={{ fontSize: 'var(--fw-fontSize-sm)', marginBottom: 'var(--fw-spacing-3)' }}>
                Behavior + token-driven visuals. One data attribute added. CSS file with intermediate variables.
              </p>
              <pre><code>{`import { Button } from 'flintwork';
import 'flintwork/styles/button.css';

<Button
  variant="primary"
  onClick={handleSubmit}
>
  Submit
</Button>`}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Install</h2>
        <div className="demo-panel">
          <div className="demo-code">
            <pre><code>npm install flintwork</code></pre>
          </div>
        </div>
      </div>
    </>
  );
}
