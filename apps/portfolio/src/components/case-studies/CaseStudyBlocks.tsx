import type { ReactNode } from 'react';

export function CaseStudySection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      className="case-study-section"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="case-study-section-title">
        {title}
      </h2>
      <div className="case-study-section-content">{children}</div>
    </section>
  );
}

export function CaseStudyCallout({ children }: { children: ReactNode }) {
  return (
    <aside className="case-study-callout" aria-label="Note">
      <p className="case-study-callout-label">Note</p>
      <div className="case-study-callout-body">{children}</div>
    </aside>
  );
}

export function CaseStudyDiagram({ title, children }: { title?: string; children: string }) {
  return (
    <figure className="case-study-figure case-study-bleed">
      <div className="case-study-code-shell case-study-diagram">
        {title ? <figcaption className="case-study-code-caption">{title}</figcaption> : null}
        <pre className="case-study-code-block">
          <code>{children}</code>
        </pre>
      </div>
    </figure>
  );
}

export function CodeExample({ title, children }: { title: string; children: string }) {
  return (
    <figure className="case-study-figure case-study-bleed">
      <div className="case-study-code-shell">
        <figcaption className="case-study-code-caption">{title}</figcaption>
        <pre className="case-study-code-block">
          <code>{children}</code>
        </pre>
      </div>
    </figure>
  );
}

export { CaseStudyImage } from './CaseStudyImage';
