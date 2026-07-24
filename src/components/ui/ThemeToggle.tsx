'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme} className="p-2 rounded-xl bg-navy/5 hover:bg-navy/10 text-navy hover:text-sky transition-all duration-200 dark:bg-navy-light/40 dark:hover:bg-navy-light/60 dark:text-beige-light dark:hover:text-cream" title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}>
    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>;
}
