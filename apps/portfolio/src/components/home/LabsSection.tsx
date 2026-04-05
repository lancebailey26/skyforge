'use client';

import { Card, Container } from '@lancebailey26/skyforge-ui';
import { Lab } from '@/types/lab';
import { useRouter } from 'next/navigation';
import { metadata as prismMetadata } from '@/app/labs/prism/metadata';
import { metadata as refractMetadata } from '@/app/labs/refract/metadata';
import { metadata as wasteOfTimeMetadata } from '@/app/labs/wasteOfTime/metadata';
import { metadata as workflowMetadata } from '@/app/labs/workflow/metadata';

const labs: Lab[] = [prismMetadata, refractMetadata, wasteOfTimeMetadata, workflowMetadata];

export function LabsSection() {
  const router = useRouter();

  return (
    <section
      id="labs"
      className="portfolio-section-anchor portfolio-snap-section"
      style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Container size="large" padding="lg" glass={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              Labs
            </h2>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-on-surface-alt)',
                lineHeight: 1.6,
                maxWidth: '800px',
              }}
            >
              Experimental projects and tools. Usually things too small to be a full app.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
              width: '100%',
            }}
          >
            {labs.map((lab) => (
              <Card
                key={lab.id}
                title={lab.title}
                subject={{ src: `/assets/${lab.id}.png`, alt: `${lab.title} screenshot` }}
                description={lab.description}
                size="small"
                type="glass"
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(lab.route)}
              />
            ))}
          </div>

          {labs.length === 0 && (
            <div
              style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--color-on-surface-alt)',
              }}
            >
              <p>No labs available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
