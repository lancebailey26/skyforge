'use client';

import { Card, Crawler } from '@lancebailey26/skyforge-ui';
import { Lab } from '@/types/lab';
import { useRouter } from 'next/navigation';
import { metadata as prismMetadata } from '@/app/labs/prism/metadata';
import { metadata as refractMetadata } from '@/app/labs/refract/metadata';
import { metadata as wasteOfTimeMetadata } from '@/app/labs/wasteOfTime/metadata';
import { metadata as workflowMetadata } from '@/app/labs/workflow/metadata';

const labs: Lab[] = [prismMetadata, refractMetadata, wasteOfTimeMetadata, workflowMetadata];

const signalLabels = ['Sandboxes', 'UI experiments', 'Small tools'];

function LabCard({ lab, onOpen }: { lab: Lab; onOpen: () => void }) {
  return (
    <Card
      title={lab.title}
      subject={{ src: `/assets/${lab.id}.png`, alt: `${lab.title} screenshot` }}
      description={lab.description}
      size="medium"
      type="glass"
      style={{ cursor: 'pointer', height: '100%' }}
      onClick={onOpen}
    />
  );
}

export function LabsSection() {
  const router = useRouter();

  return (
    <section
      id="labs"
      className="portfolio-section-anchor portfolio-snap-section portfolio-section-ambient portfolio-showcase-section"
      data-ambient="3"
      aria-labelledby="labs-heading"
    >
      <div className="portfolio-showcase-shell">
        <div className="portfolio-showcase-copy">
          <header className="portfolio-showcase-header">
            <p className="portfolio-showcase-eyebrow">Playground</p>
            <h2 id="labs-heading" className="portfolio-showcase-title">
              Labs
            </h2>
            <p className="portfolio-showcase-subtitle">
              Smaller builds and half-finished sparks—where I try interactions, workflows, and ideas that don&apos;t
              need a full product wrapper.
            </p>
          </header>

          <ul className="portfolio-showcase-tags" aria-label="Lab themes">
            {signalLabels.map((label) => (
              <li key={label}>
                <span className="portfolio-showcase-tag">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="portfolio-showcase-visual">
          <div className="portfolio-showcase-stage">
            <p className="portfolio-showcase-stage-kicker">Try the demos</p>
            {labs.length > 0 ?
(
              <div className="tech-marquee-track">
                {labs.length <= 1 ?
(
                  <div className="tech-marquee-single-slot">
                    <div className="tech-marquee-single-slot-inner">
                      <LabCard lab={labs[0]} onOpen={() => router.push(labs[0].route)} />
                    </div>
                  </div>
                ) :
(
                  <Crawler orientation="horizontal" speed={32} gap="clamp(1rem, 3vw, 2rem)" pauseOnHover>
                    {labs.map((lab) => (
                      <div key={lab.id} className="tech-marquee-crawler-card">
                        <LabCard lab={lab} onOpen={() => router.push(lab.route)} />
                      </div>
                    ))}
                  </Crawler>
                )}
              </div>
            ) :
(
              <p className="portfolio-showcase-empty">No labs here yet—something new usually shows up soon.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}