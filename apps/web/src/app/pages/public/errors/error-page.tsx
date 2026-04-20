import { useRouteError } from 'react-router-dom';
import { ErrorPageShell } from '../../../components/error-page-shell';
import { getRouteErrorDetails } from '../../../utils/route-error';

export function ErrorPage() {
  const error = useRouteError();
  const { description, status, title } = getRouteErrorDetails(error, {
    fallbackDescription: 'The page could not be loaded. Try returning to the home page.',
    unexpectedDescription: 'An unexpected error interrupted this screen.',
    unexpectedTitle: 'Unexpected application error',
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f1e7_0%,#efe5d1_52%,#d7e0c8_100%)] px-4 py-8 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] place-items-center">
        <ErrorPageShell
          actionLabel="Back to home"
          actionTo="/"
          description={description}
          helperText="Refresh the page or return home and try the flow again."
          status={status}
          title={title}
        />
      </div>
    </main>
  );
}
