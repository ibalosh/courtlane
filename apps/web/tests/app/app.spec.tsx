import { screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { renderApp } from '../utils/render-app';

function setLocation(path: string) {
  window.history.pushState({}, '', path);
}

describe('App', () => {
  beforeEach(() => {
    setLocation('/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setLocation('/');
  });
  it('renders successfully', () => {
    const { baseElement } = renderApp();
    expect(baseElement).toBeTruthy();
  });

  it('renders the landing page by default', () => {
    renderApp();
    expect(screen.getByText(/reserve the right court/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /log in/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeTruthy();
  });

  it('redirects unauthenticated account routes to login', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ user: null }),
    } as Response);
    setLocation('/account');

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeTruthy();
      expect(window.location.pathname).toBe('/login');
    });
  });

  it('renders the dashboard page for authenticated users', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        user: {
          id: 'user_123',
          name: 'Casey Player',
          email: 'casey@example.com',
        },
      }),
    } as Response);
    setLocation('/account/dashboard-page');

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/weekly court planner/i)).toBeTruthy();
      expect(screen.getByRole('button', { name: /^Monday$/i })).toBeTruthy();
      expect(screen.getByText(/12:00 am/i)).toBeTruthy();
      expect(screen.getAllByText(/court 1/i).length).toBeGreaterThan(0);
    });
  });
});
