import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAuthPageHref } from '../../utils/auth-redirect';

type AuthLayoutContent = {
  title: string;
  description: string;
  altLabel: string;
  altAction: string;
};

const authPageContent: Record<string, AuthLayoutContent> = {
  '/login': {
    title: 'Welcome back',
    description: 'Log in to manage your bookings and account.',
    altLabel: 'Need an account?',
    altAction: 'Sign up',
  },
  '/signup': {
    title: 'Create your account',
    description: 'Start with email and password. Court reservations come next.',
    altLabel: 'Already have an account?',
    altAction: 'Log in',
  },
};

export function AuthLayout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isSignupPage = location.pathname === '/signup';
  const content =
    authPageContent[location.pathname] ?? authPageContent['/login'];
  const altPath = isSignupPage ? '/login' : '/signup';

  return (
    <main className="app-page-shell relative flex items-center justify-center overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0,_transparent_60%,_rgba(15,23,42,0.06)_100%)]" />
      <Card className="relative z-10 w-full max-w-md bg-background/90 shadow-[0_1.5rem_4rem_rgba(71,46,21,0.14)] backdrop-blur-[12px]">
        <CardHeader>
          <Button asChild className="w-fit px-0" variant="link">
            <Link to="/">Back to home</Link>
          </Button>
          <CardTitle>{content.title}</CardTitle>
          <CardDescription>{content.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            {content.altLabel}{' '}
            <Button asChild className="h-auto px-0" size={null} variant="link">
              <Link to={getAuthPageHref(altPath, searchParams.get('redirect'))}>
                {content.altAction}
              </Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
