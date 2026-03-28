import { useState } from 'react';
import { Button, Dialog, Tabs, Tooltip, Accordion, Popover, Menu, Select } from 'flintwork';

const dropStyle: React.CSSProperties = { position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 50 };
const tipStyle: React.CSSProperties = { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8, whiteSpace: 'nowrap' };

function InlineTooltip({ label, tip }: { label: string; tip: string }) {
  const [c, setC] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setC} style={{ position: 'relative', display: 'inline-block' }}>
      <Tooltip>
        <Tooltip.Trigger><Button variant="secondary">{label}</Button></Tooltip.Trigger>
        {c && <Tooltip.Portal container={c}><Tooltip.Content style={tipStyle}>{tip}</Tooltip.Content></Tooltip.Portal>}
      </Tooltip>
    </div>
  );
}

export function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAction, setMenuAction] = useState('');
  const [popC, setPopC] = useState<HTMLDivElement | null>(null);
  const [menuC, setMenuC] = useState<HTMLDivElement | null>(null);
  const [selC, setSelC] = useState<HTMLDivElement | null>(null);

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
        <p style={{ marginBottom: 16 }}>
          All 8 components rendered together. Toggle the theme to see every token update simultaneously.
        </p>

        <div className="demo-panel" style={{ overflow: 'visible' }}>
          <div className="demo-preview" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 24, overflow: 'visible' }}>

            <div>
              <h3>Button</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
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
                <Dialog.Trigger><Button variant="secondary">Open Dialog</Button></Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay />
                  <Dialog.Content>
                    <Dialog.Title>Confirm action</Dialog.Title>
                    <Dialog.Description>Focus trapped. Escape or overlay click to close.</Dialog.Description>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}>
                      <Dialog.Close><Button variant="secondary">Cancel</Button></Dialog.Close>
                      <Dialog.Close><Button variant="primary">Confirm</Button></Dialog.Close>
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
                <Tabs.Panel value="overview">Arrow keys navigate. Home/End jump to first/last.</Tabs.Panel>
                <Tabs.Panel value="usage">Import styled component and its CSS file.</Tabs.Panel>
                <Tabs.Panel value="api">Compound API: Tabs.List, Tabs.Trigger, Tabs.Panel.</Tabs.Panel>
              </Tabs>
            </div>

            <div style={{ overflow: 'visible', paddingTop: 40 }}>
              <h3>Tooltip</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                <InlineTooltip label="Hover me" tip="700ms on hover, instant on focus" />
                <InlineTooltip label="Or focus me" tip="Escape to dismiss" />
              </div>
            </div>

            <div>
              <h3>Accordion</h3>
              <Accordion type="single" defaultValue="acc-1">
                <Accordion.Item value="acc-1">
                  <Accordion.Trigger>First section</Accordion.Trigger>
                  <Accordion.Content>Content for the first section. Click another to switch.</Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="acc-2">
                  <Accordion.Trigger>Second section</Accordion.Trigger>
                  <Accordion.Content>Content for the second section.</Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </div>

            <div style={{ overflow: 'visible' }}>
              <h3>Popover</h3>
              <div ref={setPopC} style={{ position: 'relative', display: 'inline-block' }}>
                <Popover>
                  <Popover.Trigger><Button variant="secondary">Open Popover</Button></Popover.Trigger>
                  {popC && (
                    <Popover.Portal container={popC}>
                      <Popover.Content style={{ ...dropStyle, minWidth: 220, padding: 16 }}>
                        <p style={{ marginBottom: 12, fontSize: 14 }}>Non-modal popup. Focus trapped.</p>
                        <Popover.Close><Button variant="primary" size="sm">Done</Button></Popover.Close>
                      </Popover.Content>
                    </Popover.Portal>
                  )}
                </Popover>
              </div>
            </div>

            <div style={{ overflow: 'visible' }}>
              <h3>Menu</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div ref={setMenuC} style={{ position: 'relative', display: 'inline-block' }}>
                  <Menu>
                    <Menu.Trigger><Button variant="secondary">Actions</Button></Menu.Trigger>
                    {menuC && (
                      <Menu.Portal container={menuC}>
                        <Menu.Content style={dropStyle}>
                          <Menu.Item onSelect={() => setMenuAction('Edit')}>Edit</Menu.Item>
                          <Menu.Item onSelect={() => setMenuAction('Duplicate')}>Duplicate</Menu.Item>
                          <Menu.Item onSelect={() => setMenuAction('Archive')}>Archive</Menu.Item>
                          <Menu.Item disabled>Delete</Menu.Item>
                        </Menu.Content>
                      </Menu.Portal>
                    )}
                  </Menu>
                </div>
                {menuAction && <span style={{ fontSize: 12, color: 'var(--fw-color-text-tertiary)' }}>Last: {menuAction}</span>}
              </div>
            </div>

            <div style={{ overflow: 'visible' }}>
              <h3>Select</h3>
              <div ref={setSelC} style={{ position: 'relative', display: 'inline-block' }}>
                <Select defaultValue="react">
                  <Select.Trigger><Select.Value placeholder="Choose framework" /></Select.Trigger>
                  {selC && (
                    <Select.Portal container={selC}>
                      <Select.Content style={{ ...dropStyle, minWidth: 180 }}>
                        <Select.Item value="react">React</Select.Item>
                        <Select.Item value="vue">Vue</Select.Item>
                        <Select.Item value="svelte">Svelte</Select.Item>
                        <Select.Item value="angular" disabled>Angular</Select.Item>
                      </Select.Content>
                    </Select.Portal>
                  )}
                </Select>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Architecture</h2>
        <p style={{ marginBottom: 16 }}>Two layers. Pick the one you need.</p>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">Headless Primitive</div>
            <div className="comparison-panel-body">
              <p style={{ fontSize: 14, marginBottom: 12 }}>Behavior only. Zero styling.</p>
              <pre><code>{`import { Button } from 'flintwork/primitives';`}</code></pre>
            </div>
          </div>
          <div className="comparison-panel">
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body">
              <p style={{ fontSize: 14, marginBottom: 12 }}>Behavior + token-driven visuals.</p>
              <pre><code>{`import { Button } from 'flintwork';
import 'flintwork/styles/button.css';`}</code></pre>
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
