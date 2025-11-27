'use client';

import { Toggle } from '@skyforge/ui';
import { useTheme } from 'next-themes';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

export function HeaderActions() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if(!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <Toggle
      checked={isDark}
      onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      iconOff={faSun}
      iconOn={faMoon}
      size="medium"
    />
  );
}