import { useRouteError } from 'react-router-dom';
import { ErrorPageShell } from '../../../components/error-page-shell';
import { getRouteErrorDetails } from '../../../utils/route-error';

export function ErrorPage() {
  const error = useRouteError();
  const { description, status, title } = getRouteErrorDetails(error, {
    fallbackDescription: 'The account screen could not be loaded. Try returning to your dashboard.',
    unexpectedDescription: 'An unexpected error interrupted your account screen.',
    unexpectedTitle: 'Unexpected account error',
  });

  return (
    <section className="mx-auto grid min-h-[calc(100vh-12rem)] place-items-center">
      <ErrorPageShell
        actionLabel="Back to account"
        actionTo="/account"
        description={description}
        helperText="Refresh the page or return to the account area and retry from a stable screen."
        status={status}
        title={title}
      />
    </section>
  );
}
