import { ErrorPageShell } from '../../../components/error-page-shell';

export function NotFoundPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-12rem)] place-items-center">
      <ErrorPageShell
        actionLabel="Back to account"
        actionTo="/account"
        description="This account route does not exist or the URL is incorrect."
        helperText="Return to your account area and continue from a known screen."
        status={404}
        title="Account page not found"
      />
    </section>
  );
}
