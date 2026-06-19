'use client';

import type { CSSProperties, ReactNode } from 'react';

export type PortfolioStackItemProps = {
  title: string;
  meta?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  placeholderColor?: string;
  onClick?: () => void;
  trailing?: ReactNode;
  className?: string;
};

export function PortfolioStackList({ children }: { children: ReactNode }) {
  return <ul className="portfolio-stack-list">{children}</ul>;
}

export function PortfolioStackItem({
  title,
  meta,
  description,
  imageSrc,
  placeholderColor,
  onClick,
  trailing,
  className,
}: PortfolioStackItemProps) {
  const interactive = Boolean(onClick);
  const mediaStyle: CSSProperties | undefined = !imageSrc && placeholderColor ?
    { backgroundColor: placeholderColor } :
    undefined;

  const content = (
    <>
      <span className="portfolio-stack-item-media" style={mediaStyle} aria-hidden={!imageSrc && !placeholderColor}>
        {imageSrc ?
          (
            <img src={imageSrc} alt="" loading="lazy" decoding="async" draggable={false} />
          ) :
          null}
      </span>
      <span className="portfolio-stack-item-body">
        <span className="portfolio-stack-item-title">{title}</span>
        {meta ?
          <span className="portfolio-stack-item-meta">{meta}</span> :
          null}
        {description ?
          <span className="portfolio-stack-item-description">{description}</span> :
          null}
      </span>
      {trailing ?? (interactive ? <span className="portfolio-stack-item-chevron" aria-hidden>›</span> : null)}
    </>
  );

  if(interactive) {
    return (
      <li className="portfolio-stack-item-wrap">
        <button
          type="button"
          className={`portfolio-stack-item${className ? ` ${className}` : ''}`}
          onClick={onClick}
          aria-label={title}
        >
          {content}
        </button>
      </li>
    );
  }

  return (
    <li className={`portfolio-stack-item-wrap${className ? ` ${className}` : ''}`}>
      <div className="portfolio-stack-item portfolio-stack-item--static" aria-label={title}>
        {content}
      </div>
    </li>
  );
}