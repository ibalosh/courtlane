import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Theme = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  resolvedTheme: 'light' | 'dark';
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const THEME_STORAGE_KEY = 'courtlane-theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getThemeMediaQuery() {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return null;
  }

  return window.matchMedia('(prefers-color-scheme: dark)');
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === 'light' ||
    storedTheme === 'dark' ||
    storedTheme === 'system'
    ? storedTheme
    : 'system';
}

function getSystemTheme(): 'light' | 'dark' {
  const mediaQuery = getThemeMediaQuery();

  if (!mediaQuery) {
    return 'light';
  }

  return mediaQuery.matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    resolveTheme(getStoredTheme()),
  );

  useEffect(() => {
    const nextResolvedTheme = resolveTheme(theme);
    applyTheme(nextResolvedTheme);
    setResolvedTheme(nextResolvedTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (theme !== 'system') {
      return;
    }

    const mediaQuery = getThemeMediaQuery();

    if (!mediaQuery) {
      return;
    }

    function handleChange() {
      const nextSystemTheme = getSystemTheme();
      applyTheme(nextSystemTheme);
      setResolvedTheme(nextSystemTheme);
    }

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider.');
  }

  return context;
}
