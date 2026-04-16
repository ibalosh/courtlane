import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from '../../src/app/app';

describe('App', () => {
  function renderApp() {
    const queryClient = new QueryClient();

    return render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
  }

  it('should render successfully', () => {
    const { baseElement } = renderApp();
    expect(baseElement).toBeTruthy();
  });

  it('should render the login page by default', () => {
    const { getByText } = renderApp();
    expect(getByText(/welcome back/i)).toBeTruthy();
  });
});
