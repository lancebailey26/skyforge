'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type CaseStudyImageProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function CaseStudyImage({ src, alt, caption }: CaseStudyImageProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const captionId = useId();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [close, open]);

  const lightbox =
    open && mounted ?
      createPortal(
        <div
          className="case-study-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          aria-describedby={caption ? captionId : undefined}
        >
          <button
            type="button"
            className="case-study-lightbox-backdrop"
            aria-label="Close enlarged image"
            onClick={close}
          />
          <div className="case-study-lightbox-panel">
            <button
              ref={closeRef}
              type="button"
              className="case-study-lightbox-close"
              aria-label="Close enlarged image"
              onClick={close}
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="case-study-lightbox-image" />
            {caption ? (
              <p id={captionId} className="case-study-lightbox-caption">
                {caption}
              </p>
            ) : null}
          </div>
        </div>,
        document.body,
      ) :
      null;

  return (
    <>
      <figure className="case-study-figure case-study-bleed case-study-image">
        <button
          ref={triggerRef}
          type="button"
          className="case-study-image-trigger"
          onClick={() => setOpen(true)}
          aria-label={`View larger: ${alt}`}
        >
          <span className="case-study-image-shell">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" decoding="async" aria-hidden="true" />
          </span>
          <span className="case-study-image-expand" aria-hidden="true">
            Enlarge
          </span>
        </button>
        {caption ? <figcaption className="case-study-image-caption">{caption}</figcaption> : null}
      </figure>
      {lightbox}
    </>
  );
}
