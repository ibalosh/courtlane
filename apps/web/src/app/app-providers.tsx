import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';

type AppProvidersProps = {
  children: ReactNode;
  queryClient?: QueryClient;
};

export function AppProviders({
  children,
  queryClient = new QueryClient(),
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
