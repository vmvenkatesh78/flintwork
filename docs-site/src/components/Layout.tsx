import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  readonly children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="docs-layout">
      <Sidebar />
      <main className="docs-main">
        <div className="docs-content">
          {children}
        </div>
      </main>
    </div>
  );
}
