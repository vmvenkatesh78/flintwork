import { useState } from 'react';
import { Button, Menu } from 'flintwork';
import { CodeBlock } from '@/components/CodeBlock';
import { DomPreview } from '@/components/DomPreview';

const MENU_DOM = `<button
  aria-haspopup="menu"
  aria-expanded="true"
  aria-controls="menu-1"
  type="button"
>Actions</button>

<div
  id="menu-1"
  data-fw-menu-content=""
  role="menu"
  aria-orientation="vertical"
>
  <div role="menuitem" data-fw-menu-item="" tabindex="0">Edit</div>
  <div role="menuitem" data-fw-menu-item="" tabindex="-1">Duplicate</div>
  <div role="menuitem" data-fw-menu-item="" tabindex="-1"
    data-disabled="" aria-disabled="true">Delete</div>
</div>`;

function DemoMenu() {
  const [lastAction, setLastAction] = useState('');

  return (
    <div>
      <Menu>
        <Menu.Trigger>
          <Button variant="secondary">Actions</Button>
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Content>
            <Menu.Item onSelect={() => setLastAction('Edit')}>Edit</Menu.Item>
            <Menu.Item onSelect={() => setLastAction('Duplicate')}>Duplicate</Menu.Item>
            <Menu.Item onSelect={() => setLastAction('Archive')}>Archive</Menu.Item>
            <Menu.Item onSelect={() => setLastAction('Delete')} disabled>Delete</Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </Menu>
      {lastAction && (
        <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-2)' }}>
          Last action: {lastAction}
        </p>
      )}
    </div>
  );
}

export function MenuPage() {
  return (
    <>
      <div className="page-header">
        <h1>Menu</h1>
        <p>
          Dropdown list of actions. Arrow keys navigate, typeahead jumps to matching items,
          selection closes the menu. For persistent interactive content, use Popover.
        </p>
      </div>

      <div className="demo-section">
        <h2>Headless vs Styled</h2>
        <div className="comparison-grid">
          <div className="comparison-panel">
            <div className="comparison-panel-header">DOM Output (Headless)</div>
            <div className="comparison-panel-body">
              <DomPreview html={MENU_DOM} />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                <code>role="menu"</code>, <code>role="menuitem"</code>. Items are <code>&lt;div&gt;</code>, not <code>&lt;button&gt;</code>.
              </p>
            </div>
          </div>
          <div className="comparison-panel">
            <div className="comparison-panel-header">Styled Wrapper</div>
            <div className="comparison-panel-body">
              <DemoMenu />
              <p style={{ fontSize: 'var(--fw-fontSize-xs)', color: 'var(--fw-color-text-tertiary)', marginTop: 'var(--fw-spacing-3)' }}>
                Hover highlight, disabled opacity, focus-visible styles.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>Keyboard Navigation</h2>
        <p style={{ marginBottom: 'var(--fw-spacing-4)' }}>
          Open the menu above and test:
        </p>
        <ul style={{ fontSize: 'var(--fw-fontSize-sm)', color: 'var(--fw-color-text-secondary)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--fw-spacing-2)' }}>
          <li><code>ArrowDown</code> / <code>ArrowUp</code> — navigate between items</li>
          <li><code>Home</code> / <code>End</code> — jump to first / last item</li>
          <li><code>Enter</code> / <code>Space</code> — select item and close menu</li>
          <li><code>Escape</code> — close without selecting, focus returns to trigger</li>
          <li>Type a letter to jump to the first matching item (typeahead)</li>
          <li>Disabled items are skipped during arrow navigation</li>
        </ul>
      </div>

      <div className="demo-section">
        <h2>Sub-components</h2>
        <table className="token-table">
          <thead><tr><th>Component</th><th>Styled layer</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>Menu</code></td><td>Pass-through</td><td>Root context provider</td></tr>
            <tr><td><code>Menu.Trigger</code></td><td>Pass-through</td><td>Toggles menu on click</td></tr>
            <tr><td><code>Menu.Portal</code></td><td>Pass-through</td><td>Renders children in a portal</td></tr>
            <tr><td><code>Menu.Content</code></td><td>data-fw-menu-content</td><td>Menu container with roving tabindex</td></tr>
            <tr><td><code>Menu.Item</code></td><td>data-fw-menu-item</td><td>Actionable item, closes on select</td></tr>
          </tbody>
        </table>
      </div>

      <div className="demo-section">
        <h2>Import</h2>
        <CodeBlock code={`// Styled
import { Menu } from 'flintwork';
import 'flintwork/styles/menu.css';

// Headless
import { Menu } from 'flintwork/primitives';`} />
      </div>
    </>
  );
}
