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
    vi.spyOn(global, 'fetch').mockImplementation((input) => {
      const url = String(input);

      if (url.includes('/auth/me')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            user: {
              id: 1,
              accountId: 1,
              name: 'Casey Player',
              email: 'casey@example.com',
            },
          }),
        } as Response);
      }

      if (url.includes('/reservations/week')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            week: {
              start: '2026-04-20',
              end: '2026-04-26',
              days: [
                { date: '2026-04-20', label: 'Monday' },
                { date: '2026-04-21', label: 'Tuesday' },
                { date: '2026-04-22', label: 'Wednesday' },
                { date: '2026-04-23', label: 'Thursday' },
                { date: '2026-04-24', label: 'Friday' },
                { date: '2026-04-25', label: 'Saturday' },
                { date: '2026-04-26', label: 'Sunday' },
              ],
            },
            courts: [
              {
                id: 1,
                name: 'Court 1',
                sortOrder: 1,
              },
            ],
            slots: [
              {
                startTime: '09:00',
                label: '9:00 AM',
                startMinutes: 540,
                endMinutes: 585,
              },
              {
                startTime: '23:15',
                label: '11:15 PM',
                startMinutes: 1395,
                endMinutes: 1440,
              },
            ],
            reservations: [],
          }),
        } as Response);
      }

      return Promise.reject(new Error(`Unhandled fetch request: ${url}`));
    });
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
