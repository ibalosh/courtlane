import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { AccountLayout } from './pages/account/account-layout';
import { AccountPage } from './pages/account/account-page';
import { DashboardPage } from './pages/account/dashboard-page';
import { LoginPage } from './pages/public/login-page';
import { SignupPage } from './pages/public/signup-page';
import { ErrorPage as AccountErrorPage, NotFoundPage as AccountNotFoundPage } from './pages/account/errors';
import { ErrorPage as PublicErrorPage, NotFoundPage as PublicNotFoundPage } from './pages/public/errors';

export function createAppRouter() {
  return createBrowserRouter([
    {
      errorElement: <PublicErrorPage />,
      path: '/',
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'signup',
          element: <SignupPage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: '*',
          element: <PublicNotFoundPage />,
        },
      ],
    },
    {
      path: '/account',
      element: <AccountLayout />,
      errorElement: <AccountErrorPage />,
      children: [
        {
          element: <AccountPage />,
          children: [
            {
              index: true,
              element: <Navigate replace to="/account/dashboard-page" />,
            },
            {
              path: 'dashboard-page',
              element: <DashboardPage />,
            },
            {
              path: '*',
              element: <AccountNotFoundPage />,
            },
          ],
        },
      ],
    },
  ]);
}

function App() {
  const router = createAppRouter();
  return <RouterProvider router={router} />;
}

export default App;
