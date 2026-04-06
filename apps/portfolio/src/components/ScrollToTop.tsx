'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function scrollToHashOrTop() {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

  const hash = window.location.hash;
  if (hash.length > 1) {
    const id = decodeURIComponent(hash.slice(1));
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
        return;
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    scrollToHashOrTop();
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => scrollToHashOrTop();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return null;
}
