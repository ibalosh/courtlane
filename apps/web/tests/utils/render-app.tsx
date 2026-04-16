import { render } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import App from '../../src/app/app';
import { AppProviders } from '../../src/app/app-providers';

export function renderApp() {
  const queryClient = new QueryClient();

  return render(
    <AppProviders queryClient={queryClient}>
      <App />
    </AppProviders>,
  );
}
