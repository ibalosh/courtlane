export function AccountFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col gap-2 border-t border-slate-900/10 pt-6 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between m-4">
      <p>Courtlane {year}. Built for clear, reliable court reservations.</p>
      <p className="text-slate-600">Manage your schedule with less friction.</p>
    </footer>
  );
}
