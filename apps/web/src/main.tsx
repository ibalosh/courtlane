import { StrictMode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { AppProviders } from './app/app-providers';
import './styles.css';

const supportsMatchMedia = typeof window.matchMedia === 'function';
const storedTheme = window.localStorage.getItem('courtlane-theme');
const preferredTheme =
  storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
    ? storedTheme
    : 'system';
const initialTheme =
  preferredTheme === 'system'
    ? supportsMatchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    : preferredTheme;

document.documentElement.classList.toggle('dark', initialTheme === 'dark');
document.documentElement.style.colorScheme = initialTheme;

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <AppProviders queryClient={queryClient}>
      <App />
    </AppProviders>
  </StrictMode>,
);
