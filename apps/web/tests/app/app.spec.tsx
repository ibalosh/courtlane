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

  it('renders the login page by default', () => {
    renderApp();
    expect(screen.getByText(/welcome back/i)).toBeTruthy();
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
});
