import { StrictMode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { AppProviders } from './app/app-providers';
import './styles.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <AppProviders queryClient={queryClient}>
      <App />
    </AppProviders>
  </StrictMode>,
);
