'use client';
import { Card, Container } from '@skyforge/ui';
import { useTitle } from '@/hooks/useTitle';
import { Lab } from '@/types/lab';
import { useRouter } from 'next/navigation';
import { metadata as prismMetadata } from './prism/metadata';

// Import all lab metadata here
const labs: Lab[] = [
  prismMetadata,
];

export default function LabsPage() {
  useTitle('Labs');
  const router = useRouter();

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Container size="large" padding="lg" glass={true}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              Labs
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-on-surface-alt)',
              lineHeight: 1.6,
              maxWidth: '800px'
            }}>
              Experimental projects and tools.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            width: '100%'
          }}>
            {labs.map((lab) => (
              <Card
                key={lab.id}
                title={lab.title}
                subject={lab.color ? { color: lab.color } : undefined}
                description={lab.description}
                size="small"
                type="glass"
                style={{ cursor: 'pointer' }}
                onClick={() => router.push(lab.route)}
              />
            ))}
          </div>

          {labs.length === 0 && (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--color-on-surface-alt)'
            }}>
              <p>No labs available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}