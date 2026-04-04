export type SkyforgeDensity = 'comfortable' | 'compact';

/**
 * Toggle global spacing rhythm for @skyforge/ui (html[data-density="compact"]).
 * Call from a client component (e.g. layout) on mount or when user preference changes.
 */
export function setSkyforgeDensity(mode: SkyforgeDensity): void {
  if(typeof document === 'undefined')return;
  const root = document.documentElement;
  if(mode === 'compact') {
    root.setAttribute('data-density', 'compact');
  } else {
    root.removeAttribute('data-density');
  }
}