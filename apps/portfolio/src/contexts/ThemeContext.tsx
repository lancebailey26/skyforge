'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return { theme, setTheme };
}