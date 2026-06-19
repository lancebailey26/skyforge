'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Crawler, Tag } from '@lancebailey26/skyforge-ui';
import { referenceWork } from '@/data/reference-work';
import type { ReferenceWorkItem } from '@/types/reference-work';
import { PortfolioStackItem, PortfolioStackList } from '@/components/PortfolioStackItem';

const signalLabels = ['Design systems', 'Production UI', 'Architecture', 'Adoption at scale'];

function ReferenceWorkCard({ item, onOpen }: { item: ReferenceWorkItem; onOpen: () => void }) {
  const subject = item.imageUrl ?
    { src: item.imageUrl, alt: item.title } :
    { color: 'color-mix(in oklch, var(--color-primary) 14%, var(--color-container-high))' };

  return (
    <Card
      title={item.title}
      tagline={item.tags[0]}
      subject={subject}
      description={item.description}
      size="medium"
      type="glass"
      style={{ cursor: 'pointer', height: '100%' }}
      onClick={onOpen}
      footer={
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {item.techStack.map((tech) => (
            <Tag key={tech} text={tech} size="tiny" color="info" />
          ))}
        </div>
      }
      footerStyle={{ padding: '1rem 1rem' }}
    />
  );
}

function ReferenceWorkStackItem({ item, onOpen }: { item: ReferenceWorkItem; onOpen: () => void }) {
  return (
    <PortfolioStackItem
      title={item.title}
      meta={item.tags[0]}
      description={item.description}
      imageSrc={item.imageUrl}
      imageAlt={item.title}
      placeholderColor="color-mix(in oklch, var(--color-primary) 14%, var(--color-container-high))"
      onClick={onOpen}
    />
  );
}

function ReferenceWorkDeck({ items, onOpenItem }: { items: ReferenceWorkItem[]; onOpenItem: (route: string) => void }) {
  if(items.length <= 1) {
    return (
      <div className="tech-marquee-single-slot">
        <div className="tech-marquee-single-slot-inner">
          <ReferenceWorkCard item={items[0]} onOpen={() => onOpenItem(items[0].route)} />
        </div>
      </div>
    );
  }

  return (
    <Crawler
      orientation="horizontal"
      speed={32}
      gap="clamp(1rem, 3vw, 2rem)"
      pauseOnHover
      noScroll={items.length === 2}
      noScrollAlign="start"
      layout="list"
      list={
        <PortfolioStackList>
          {items.map((item) => (
            <ReferenceWorkStackItem key={item.slug} item={item} onOpen={() => onOpenItem(item.route)} />
          ))}
        </PortfolioStackList>
      }
    >
      {items.map((item) => (
        <div key={item.slug} className="tech-marquee-crawler-card">
          <ReferenceWorkCard item={item} onOpen={() => onOpenItem(item.route)} />
        </div>
      ))}
    </Crawler>
  );
}

export function ReferenceSection() {
  const router = useRouter();

  const items = useMemo(
    () => [...referenceWork].sort((a, b) => a.priority - b.priority),
    [],
  );

  const openItem = (route: string) => {
    router.push(route);
  };

  return (
    <section
      id="reference"
      className="portfolio-section-anchor portfolio-snap-section portfolio-section-ambient tech-marquee-section reference-section"
      data-ambient="2"
      aria-labelledby="reference-heading"
    >
      <div className="tech-marquee-shell">
        <div className="tech-marquee-copy">
          <header className="tech-marquee-header">
            <p className="tech-marquee-eyebrow">Reference work</p>
            <h2 id="reference-heading" className="tech-marquee-title">
              Reference work
            </h2>
            <p className="tech-marquee-subtitle">
              Deeper write-ups on principal engineering — systems shipped to production, how they were built, and
              why they mattered.
            </p>
          </header>

          <ul className="tech-marquee-tags" aria-label="Reference themes">
            {signalLabels.map((label) => (
              <li key={label}>
                <span className="tech-marquee-tag">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="tech-marquee-visual">
          <div className="tech-marquee-stage reference-stage">
            <p className="tech-marquee-stage-kicker">Deep dives</p>
            <div className="tech-marquee-track">
              {items.length === 0 ? (
                <p className="portfolio-showcase-empty">Reference write-ups will appear here soon.</p>
              ) : (
                <ReferenceWorkDeck items={items} onOpenItem={openItem} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}