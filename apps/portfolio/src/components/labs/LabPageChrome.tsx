'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

type LabPageChromeProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function LabPageChrome({ title, subtitle, children }: LabPageChromeProps) {
  return (
    <div className="lab-page">
      <Link href="/#labs" className="lab-page-back">
        ← Back to Labs
      </Link>
      <header className="lab-page-header">
        <p className="tech-marquee-eyebrow">Lab</p>
        <h1 className="lab-page-title">{title}</h1>
        {subtitle ? <p className="tech-marquee-subtitle lab-page-lead">{subtitle}</p> : null}
      </header>
      <div className="lab-page-body">{children}</div>
    </div>
  );
}
