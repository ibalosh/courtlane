import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Theme, useTheme } from '../theme-provider';

const themeOptions: Array<{ label: string; value: Theme }> = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <div className="bg-background/85 border-border flex items-center gap-1 rounded-full border p-1 shadow-lg backdrop-blur">
        {themeOptions.map((option) => {
          const isActive = theme === option.value;

          return (
            <Button
              key={option.value}
              className={cn(
                'rounded-full px-3',
                isActive && 'shadow-none',
                option.value === 'system' &&
                  resolvedTheme === 'dark' &&
                  'border-border',
              )}
              onClick={() => setTheme(option.value)}
              size="sm"
              type="button"
              variant={isActive ? 'default' : 'ghost'}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
