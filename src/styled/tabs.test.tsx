import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './tabs';

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

function TabsHarness({
  defaultValue = 'account',
  orientation,
}: Readonly<{
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
}>) {
  const tabsProps: { defaultValue: string; orientation?: 'horizontal' | 'vertical' } = {
    defaultValue,
  };
  if (orientation) tabsProps.orientation = orientation;

  return (
    <Tabs {...tabsProps}>
      <Tabs.List data-testid="list">

        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Billing
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="account" data-testid="panel-account">
        Account content
      </Tabs.Panel>
      <Tabs.Panel value="security" data-testid="panel-security">
        Security content
      </Tabs.Panel>
      <Tabs.Panel value="billing" data-testid="panel-billing">
        Billing content
      </Tabs.Panel>
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Styled Tabs', () => {
  // -----------------------------------------------------------------------
  // data-fw-* attributes
  // -----------------------------------------------------------------------

  describe('data attributes for CSS targeting', () => {
    it('adds data-fw-tabs-list to List', () => {
      render(<TabsHarness />);
      expect(screen.getByTestId('list')).toHaveAttribute('data-fw-tabs-list');
    });

    it('adds data-fw-tabs-trigger to every Trigger', () => {
      render(<TabsHarness />);
      const triggers = screen.getAllByRole('tab');
      for (const trigger of triggers) {
        expect(trigger).toHaveAttribute('data-fw-tabs-trigger');
      }
    });

    it('adds data-fw-tabs-panel to the active Panel', () => {
      render(<TabsHarness />);
      expect(screen.getByTestId('panel-account')).toHaveAttribute(
        'data-fw-tabs-panel',
      );
    });
  });

  // -----------------------------------------------------------------------
  // Primitive behavior preserved
  // -----------------------------------------------------------------------

  describe('primitive behavior passthrough', () => {
    it('preserves role="tablist" on List', () => {
      render(<TabsHarness />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('preserves role="tab" on Triggers', () => {
      render(<TabsHarness />);
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('preserves role="tabpanel" on the active Panel', () => {
      render(<TabsHarness />);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('preserves aria-selected on the active Trigger', () => {
      render(<TabsHarness />);
      const accountTab = screen.getByRole('tab', { name: 'Account' });
      const securityTab = screen.getByRole('tab', { name: 'Security' });
      expect(accountTab).toHaveAttribute('aria-selected', 'true');
      expect(securityTab).toHaveAttribute('aria-selected', 'false');
    });

    it('preserves aria-orientation on List', () => {
      render(<TabsHarness orientation="vertical" />);
      expect(screen.getByRole('tablist')).toHaveAttribute(
        'aria-orientation',
        'vertical',
      );
    });

    it('preserves data-state="active" on selected Trigger', () => {
      render(<TabsHarness />);
      const accountTab = screen.getByRole('tab', { name: 'Account' });
      expect(accountTab).toHaveAttribute('data-state', 'active');
    });

    it('preserves data-disabled on disabled Trigger', () => {
      render(<TabsHarness />);
      const billingTab = screen.getByRole('tab', { name: 'Billing' });
      expect(billingTab).toHaveAttribute('data-disabled');
      expect(billingTab).toHaveAttribute('aria-disabled', 'true');
    });

    it('switches panels when a trigger is clicked', () => {
      render(<TabsHarness />);
      expect(screen.getByText('Account content')).toBeInTheDocument();
      expect(screen.queryByText('Security content')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('tab', { name: 'Security' }));

      expect(screen.queryByText('Account content')).not.toBeInTheDocument();
      expect(screen.getByText('Security content')).toBeInTheDocument();
    });

    it('does not switch to disabled tab on click', () => {
      render(<TabsHarness />);
      fireEvent.click(screen.getByRole('tab', { name: 'Billing' }));
      expect(screen.getByText('Account content')).toBeInTheDocument();
      expect(screen.queryByText('Billing content')).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // Props passthrough
  // -----------------------------------------------------------------------

  describe('prop passthrough', () => {
    it('passes className to List', () => {
      render(
        <Tabs defaultValue="a">
          <Tabs.List className="custom-list">
            <Tabs.Trigger value="a">A</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="a">Content</Tabs.Panel>
        </Tabs>,
      );
      expect(screen.getByRole('tablist')).toHaveClass('custom-list');
    });

    it('passes className to Trigger', () => {
      render(
        <Tabs defaultValue="a">
          <Tabs.List>
            <Tabs.Trigger value="a" className="custom-trigger">
              A
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="a">Content</Tabs.Panel>
        </Tabs>,
      );
      expect(screen.getByRole('tab')).toHaveClass('custom-trigger');
    });

    it('passes className to Panel', () => {
      render(
        <Tabs defaultValue="a">
          <Tabs.List>
            <Tabs.Trigger value="a">A</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Panel value="a" className="custom-panel">
            Content
          </Tabs.Panel>
        </Tabs>,
      );
      expect(screen.getByRole('tabpanel')).toHaveClass('custom-panel');
    });

    it('passes data-testid through sub-components', () => {
      render(<TabsHarness />);
      expect(screen.getByTestId('list')).toBeInTheDocument();
      expect(screen.getByTestId('panel-account')).toBeInTheDocument();
    });
  });
});