'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SNAP_RESTORE_MS = 650;

function suspendScrollSnap(): () => void {
  const html = document.documentElement;
  const prev = html.style.scrollSnapType;
  html.style.scrollSnapType = 'none';
  return () => {
    html.style.scrollSnapType = prev;
  };
}

function normalizePath(path: string): string {
  const p = path.replace(/\/$/, '') || '/';
  return p;
}

function samePageSectionId(href: string): string | null {
  if(!href.includes('#')) {
    return null;
  }
  if(href.startsWith('#')) {
    const id = decodeURIComponent(href.slice(1));
    return id || null;
  }
  try {
    const u = new URL(href, window.location.origin);
    if(u.origin !== window.location.origin) {
      return null;
    }
    if(normalizePath(u.pathname) !== normalizePath(window.location.pathname)) {
      return null;
    }
    const id = u.hash.slice(1);
    return id ? decodeURIComponent(id) : null;
  } catch{
    return null;
  }
}

/** Scroll with `block: 'end'` so tall sections (e.g. contact) reveal lower content. */
export function scrollSectionIntoViewFromHash(hashedId: string) {
  const el = document.getElementById(hashedId);
  if(!el) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

  const restoreSnap = suspendScrollSnap();
  let finished = false;
  const finish = () => {
    if(finished) {
      return;
    }
    finished = true;
    restoreSnap();
  };

  el.scrollIntoView({ behavior, block: 'end', inline: 'nearest' });

  if(typeof window !== 'undefined' && 'onscrollend' in window) {
    window.addEventListener('scrollend', finish, { once: true });
  }
  window.setTimeout(finish, prefersReducedMotion ? 0 : SNAP_RESTORE_MS);
}

export function HashSectionScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if(hash.length > 1) {
      const id = decodeURIComponent(hash.slice(1));
      requestAnimationFrame(() => scrollSectionIntoViewFromHash(id));
    }
  }, [pathname]);

  useEffect(() => {
    const onHashOrPop = () => {
      const h = window.location.hash;
      if(h.length <= 1) {
        return;
      }
      const id = decodeURIComponent(h.slice(1));
      requestAnimationFrame(() => scrollSectionIntoViewFromHash(id));
    };

    window.addEventListener('hashchange', onHashOrPop);
    window.addEventListener('popstate', onHashOrPop);
    return () => {
      window.removeEventListener('hashchange', onHashOrPop);
      window.removeEventListener('popstate', onHashOrPop);
    };
  }, []);

  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if(!a || !(a instanceof HTMLAnchorElement)) {
        return;
      }
      const hrefAttr = a.getAttribute('href') ?? '';
      const id = samePageSectionId(hrefAttr);
      if(!id || !document.getElementById(id)) {
        return;
      }
      e.preventDefault();
      const resolved = new URL(a.href);
      window.history.pushState(null, '', resolved.pathname + resolved.search + resolved.hash);
      requestAnimationFrame(() => scrollSectionIntoViewFromHash(id));
    };

    document.addEventListener('click', onClickCapture, true);
    return () => document.removeEventListener('click', onClickCapture, true);
  }, []);

  return null;
}