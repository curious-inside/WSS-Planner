import React from 'react'
import { render, screen } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import DashboardPage from '../app/(dashboard)/dashboard/page'
import Providers from '@/components/Providers'

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({
    data: {
      user: {
        name: 'Test User',
      },
    },
    status: 'authenticated',
  }),
}));

describe('DashboardPage', () => {
  it('renders a welcome message', () => {
    render(
      <Providers>
        <DashboardPage />
      </Providers>
    );

    const welcomeMessage = screen.getByText(/Welcome back, Test User!/i);
    expect(welcomeMessage).toBeInTheDocument();
  });
});
