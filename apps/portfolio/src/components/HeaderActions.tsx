'use client';

import { Toggle } from '@lancebailey26/skyforge-ui';
import { useTheme } from 'next-themes';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

/** Avoid scroll-snap jump when toggling theme (class change on `html`). */
function setThemeWithoutScrollJump(next: 'dark' | 'light', setTheme: (t: string) => void) {
  const y = window.scrollY;
  const html = document.documentElement;
  const prevSnap = html.style.scrollSnapType;
  const prevBehavior = html.style.scrollBehavior;
  html.style.scrollSnapType = 'none';
  html.style.scrollBehavior = 'auto';
  setTheme(next);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
      html.style.scrollSnapType = prevSnap;
      html.style.scrollBehavior = prevBehavior;
    });
  });
}

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
      onChange={(checked) => setThemeWithoutScrollJump(checked ? 'dark' : 'light', setTheme)}
      iconOff={faSun}
      iconOn={faMoon}
      size="medium"
    />
  );
}