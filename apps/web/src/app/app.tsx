import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { ProtectedLayout } from './components/protected-layout';
import { AccountPage } from './pages/account-page';
import { DashboardPage } from './pages/dashboard-page';
import { LoginPage } from './pages/login-page';
import { RootPage } from './pages/root-page';
import { SignupPage } from './pages/signup-page';

export function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <RootPage />,
      children: [
        {
          index: true,
          element: <Navigate replace to="/login" />,
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
          element: <ProtectedLayout />,
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
