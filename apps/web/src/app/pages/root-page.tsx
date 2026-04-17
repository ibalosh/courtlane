import { Outlet } from 'react-router-dom';
import { ThemeSwitcher } from '../components/theme-switcher';

export function RootPage() {
  return (
    <>
      <Outlet />
      <ThemeSwitcher />
    </>
  );
}
