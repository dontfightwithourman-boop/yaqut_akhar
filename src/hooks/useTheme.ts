'use client';
import { useState, useEffect } from 'react';
export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => { const s = localStorage.getItem('yaghout_theme') as 'dark' | 'light' | null; const i = s || 'dark'; setTheme(i); document.documentElement.classList.toggle('dark', i === 'dark'); }, []);
  const toggleTheme = () => { const n = theme === 'dark' ? 'light' : 'dark'; setTheme(n); localStorage.setItem('yaghout_theme', n); document.documentElement.classList.toggle('dark', n === 'dark'); };
  return { theme, toggleTheme };
}
