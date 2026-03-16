import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    links: [
      { to: '/', label: 'Introduction' },
      { to: '/tokens', label: 'Tokens' },
    ],
  },
  {
    label: 'Components',
    links: [
      { to: '/components/button', label: 'Button' },
      { to: '/components/dialog', label: 'Dialog' },
      { to: '/components/tabs', label: 'Tabs' },
    ],
  },
] as const;

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <nav className="docs-sidebar">
      <div className="sidebar-logo">
        flintwork <span>v0.0.1</span>
      </div>

      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="sidebar-section">
          <div className="sidebar-section-label">{section.label}</div>
          {section.links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-link${pathname === link.to ? ' active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ))}

      <ThemeToggle />
    </nav>
  );
}
