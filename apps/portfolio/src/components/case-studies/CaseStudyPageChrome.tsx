'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

type CaseStudyPageChromeProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function CaseStudyPageChrome({
  eyebrow = 'Case study',
  title,
  subtitle,
  children,
}: CaseStudyPageChromeProps) {
  return (
    <div className="case-study-page">
      <div className="case-study-page-inner">
        <Link href="/#reference" className="case-study-back">
          ← Back to Reference work
        </Link>
        <header className="case-study-hero">
          <p className="case-study-eyebrow">{eyebrow}</p>
          <h1 className="case-study-title">{title}</h1>
          {subtitle ? <p className="case-study-lead">{subtitle}</p> : null}
        </header>
        <article className="case-study-article">{children}</article>
      </div>
    </div>
  );
}
