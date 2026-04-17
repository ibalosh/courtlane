import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { HomePage } from './pages/home-page';
import { AuthLayout } from './pages/public/auth-layout';
import { AccountLayout } from './pages/account/account-layout';
import { AccountPage } from './pages/account/account-page';
import { DashboardPage } from './pages/account/dashboard-page';
import { LoginPage } from './pages/public/login-page';
import { SignupPage } from './pages/public/signup-page';
import { RootPage } from './pages/root-page';

export function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <RootPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          element: <AuthLayout />,
          children: [
            {
              path: '/signup',
              element: <SignupPage />,
            },
            {
              path: '/login',
              element: <LoginPage />,
            },
          ],
        },
        {
          element: <AccountLayout />,
          children: [
            {
              path: '/account',
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
      ],
    },
  ]);
}

function App() {
  const router = createAppRouter();
  return <RouterProvider router={router} />;
}

export default App;
