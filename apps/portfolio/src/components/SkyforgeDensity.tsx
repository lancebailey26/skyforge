'use client';

import { setSkyforgeDensity } from '@skyforge/ui';
import { useEffect } from 'react';

/** Applies default comfortable density; switch to `compact` in code or via future user setting. */
export function SkyforgeDensity() {
  useEffect(() => {
    setSkyforgeDensity('comfortable');
  }, []);
  return null;
}
