import { useState } from 'react';
import { Button, Dialog, Tabs, Tooltip, Accordion, Popover, Menu, Select } from 'flintwork';

export function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAction, setMenuAction] = useState('');

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
          All 8 components rendered together. Toggle the theme to see every token update simultaneously.
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

            <div>
              <h3>Tooltip</h3>
              <div style={{ display: 'flex', gap: 'var(--fw-spacing-3)' }}>
                <Tooltip>
                  <Tooltip.Trigger>
                    <Button variant="secondary">Hover me</Button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content>Shows after 700ms on hover, instantly on focus</Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip>
                <Tooltip>
                  <Tooltip.Trigger>
                    <Button variant="secondary">Or focus me</Button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content>Press Escape to dismiss without moving focus</Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip>
              </div>
            </div>

            <div>
              <h3>Accordion</h3>
              <Accordion type="single" defaultValue="acc-1">
                <Accordion.Item value="acc-1">
                  <Accordion.Trigger>First section</Accordion.Trigger>
                  <Accordion.Content>Content for the first section. Click another header to switch.</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="acc-2">
                  <Accordion.Trigger>Second section</Accordion.Trigger>
                  <Accordion.Content>Content for the second section.</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="acc-3">
                  <Accordion.Trigger>Third section</Accordion.Trigger>
                  <Accordion.Content>Content for the third section.</Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </div>

            <div>
              <h3>Popover</h3>
              <Popover>
                <Popover.Trigger>
                  <Button variant="secondary">Open Popover</Button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content style={{ padding: 'var(--fw-spacing-4)', minWidth: 200 }}>
                    <p style={{ marginBottom: 'var(--fw-spacing-3)', fontSize: 'var(--fw-fontSize-sm)' }}>
                      Non-modal popup with interactive content. Focus is trapped.
                    </p>
                    <Popover.Close>
                      <Button variant="primary" size="sm">Done</Button>
                    </Popover.Close>
                  </Popover.Content>
                </Popover.Portal>
              </Popover>
            </div>

            <div>
              <h3>Menu</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fw-spacing-3)' }}>
                <Menu>
                  <Menu.Trigger>
                    <Button variant="secondary">Actions</Button>
                  </Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Content>
                      <Menu.Item onSelect={() => setMenuAction('Edit')}>Edit</Menu.Item>
                      <Menu.Item onSelect={() => setMenuAction('Duplicate')}>Duplicate</Menu.Item>
                      <Menu.Item onSelect={() => setMenuAction('Archive')}>Archive</Menu.Item>
                      <Menu.Item disabled>Delete</Menu.Item>
                    </Menu.Content>
                  </Menu.Portal>
                </Menu>
                {menuAction && (
                  <span style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)' }}>
                    Last: {menuAction}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3>Select</h3>
              <Select defaultValue="react">
                <Select.Trigger>
                  <Select.Value placeholder="Choose framework" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content>
                    <Select.Item value="react">React</Select.Item>
                    <Select.Item value="vue">Vue</Select.Item>
                    <Select.Item value="svelte">Svelte</Select.Item>
                    <Select.Item value="angular" disabled>Angular</Select.Item>
                  </Select.Content>
                </Select.Portal>
              </Select>
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
