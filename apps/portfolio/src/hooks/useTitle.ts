'use client';

import { useEffect } from 'react';

interface UseTitleOptions {
  baseTitle?: string;
  separator?: string;
  prepend?: boolean;
}

/**
 * Sets document.title. Page-only titles use base "Lance Bailey".
 */
export function useTitle(title: string, options?: UseTitleOptions) {
  const baseTitle = options?.baseTitle ?? 'Lance Bailey';
  const separator = options?.separator ?? ' | ';
  const prepend = options?.prepend ?? false;

  useEffect(() => {
    const fullTitle = title
      ? prepend
        ? `${title}${separator}${baseTitle}`
        : `${baseTitle}${separator}${title}`
      : baseTitle;
    document.title = fullTitle;
  }, [title, baseTitle, separator, prepend]);
}
