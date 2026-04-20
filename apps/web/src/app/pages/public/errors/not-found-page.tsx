import { ErrorPageShell } from '../../../components/error-page-shell';

export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f1e7_0%,#efe5d1_52%,#d7e0c8_100%)] px-4 py-8 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] place-items-center">
        <ErrorPageShell
          actionLabel="Back to home"
          actionTo="/"
          description="This page does not exist or the URL is incorrect."
          helperText="Return home and continue from a route that exists."
          status={404}
          title="Page not found"
        />
      </div>
    </main>
  );
}
