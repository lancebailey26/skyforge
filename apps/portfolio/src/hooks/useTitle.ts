'use client';

import { useEffect } from 'react';

/**
 * sets the document title dynamically. you can pass just the page name and it'll add the base title, or configure it however you want
 * @param title - the page title to set
 * @param options - optional stuff to customize how the title gets put together
 * @param options.baseTitle - the base site name that goes before or after the page title (defaults to "Skyforge")
 * @param options.separator - what goes between the base title and page title (defaults to " | ")
 * @param options.prepend - if true, puts the page title before the base title instead of after
 * @returns a function to reset the title to the previous value
 */
interface UseTitleOptions {
    baseTitle?: string;
    separator?: string;
    prepend?: boolean;
}
export function useTitle(
    title: string,
    options?: UseTitleOptions
) {
    const baseTitle = options?.baseTitle ?? 'Skyforge';
    const separator = options?.separator ?? ' | ';
    const prepend = options?.prepend ?? false;

    useEffect(() => {
        const fullTitle = title ?
          (prepend ? `${title}${separator}${baseTitle}` : `${baseTitle}${separator}${title}`) :
          baseTitle;
        document.title = fullTitle;
    }, [title, baseTitle, separator, prepend]);
}