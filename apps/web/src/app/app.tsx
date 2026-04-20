import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { AccountLayout } from './pages/account/account-layout';
import { AccountPage } from './pages/account/account-page';
import { DashboardPage } from './pages/account/dashboard-page';
import { LoginPage } from './pages/public/login-page';
import { SignupPage } from './pages/public/signup-page';

export function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/signup',
      element: <SignupPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/account',
      element: <AccountLayout />,
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
