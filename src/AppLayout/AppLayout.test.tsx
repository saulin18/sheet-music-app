import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppLayout from './AppLayout';

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  Outlet: () => <div>Outlet Content</div>,
  useRouterState: vi.fn(() => '/'),
}));

describe('AppLayout', () => {
  it('works', () => {
    render(<AppLayout />);
  });

  it('renders the correct title', () => {
    render(<AppLayout />);
    expect(screen.getByText('Sheet Music Composer')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<AppLayout />);
    expect(screen.getByText('Composer')).toBeInTheDocument();
    expect(screen.getByText('Saved Songs')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<AppLayout />);
    expect(
      screen.getByText('Create and play back sheet music in Western Notation'),
    ).toBeInTheDocument();
  });
});
