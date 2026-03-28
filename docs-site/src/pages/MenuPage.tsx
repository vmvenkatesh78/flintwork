import { useState } from 'react';
import { Button, Menu } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const MENU_DOM = `<button aria-haspopup="menu" aria-expanded="true"
  aria-controls="menu-1" type="button">Actions</button>

<div id="menu-1" data-fw-menu-content=""
  role="menu" aria-orientation="vertical">
  <div role="menuitem" data-fw-menu-item="" tabindex="0">Edit</div>
  <div role="menuitem" data-fw-menu-item="" tabindex="-1">Duplicate</div>
  <div role="menuitem" data-fw-menu-item="" tabindex="-1"
    data-disabled="" aria-disabled="true">Delete</div>
</div>`;

const dropStyle: React.CSSProperties = { position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 50 };

function DemoMenu({ onAction }: { onAction?: (a: string) => void }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setContainer} style={{ position: 'relative', display: 'inline-block' }}>
      <Menu>
        <Menu.Trigger>
          <Button variant="secondary">Actions</Button>
        </Menu.Trigger>
        {container && (
          <Menu.Portal container={container}>
            <Menu.Content style={dropStyle}>
              <Menu.Item onSelect={() => onAction?.('Edit')}>Edit</Menu.Item>
              <Menu.Item onSelect={() => onAction?.('Duplicate')}>Duplicate</Menu.Item>
              <Menu.Item onSelect={() => onAction?.('Archive')}>Archive</Menu.Item>
              <Menu.Item disabled>Delete</Menu.Item>
            </Menu.Content>
          </Menu.Portal>
        )}
      </Menu>
    </div>
  );
}

export function MenuPage() {
  const [lastAction, setLastAction] = useState('');

  return (
    <>
      <div className="page-header">
        <h1>Menu</h1>
        <p>
          Dropdown list of actions. Arrow keys navigate, typeahead jumps to matching items,
          selection closes the menu.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={MENU_DOM} />
            </div>
          </div>
          <div className="comparison-panel" style={{ overflow: 'visible' }}>
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body" style={{ overflow: 'visible', minHeight: 200 }}>
              <DemoMenu onAction={setLastAction} />
              {lastAction && (
                <p style={{ fontSize: 12, color: 'var(--fw-color-text-tertiary)', marginTop: 12 }}>
                  Last action: {lastAction}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Keyboard Navigation</h2>
        <ul className="a11y-list">
          <li><code>ArrowDown</code> / <code>ArrowUp</code> navigate items</li>
          <li><code>Home</code> / <code>End</code> jump to first / last</li>
          <li><code>Enter</code> / <code>Space</code> select and close</li>
          <li><code>Escape</code> close, focus returns to trigger</li>
          <li>Type a letter for typeahead matching</li>
          <li>Disabled items skipped during navigation</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Sub-components</h2>
        <table className="token-table">
          <thead><tr><th>Component</th><th>Styled layer</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>Menu</code></td><td>Pass-through</td><td>Root provider</td></tr>
            <tr><td><code>Menu.Trigger</code></td><td>Pass-through</td><td>Toggles on click</td></tr>
            <tr><td><code>Menu.Portal</code></td><td>Pass-through</td><td>Portal rendering</td></tr>
            <tr><td><code>Menu.Content</code></td><td>data-fw-menu-content</td><td>Menu with roving tabindex</td></tr>
            <tr><td><code>Menu.Item</code></td><td>data-fw-menu-item</td><td>Action item</td></tr>
          </tbody>
        </table>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`import { Menu } from 'flintwork';
import 'flintwork/styles/menu.css';`} />
      </div>
    </>
  );
}
