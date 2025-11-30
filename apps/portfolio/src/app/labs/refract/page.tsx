'use client';
import { useState, useMemo } from 'react';
import { Container } from '@skyforge/ui';
import { Slider } from '@skyforge/ui';
import { useTitle } from '@/hooks/useTitle';

export default function RefractPage() {
  useTitle('Refract - Labs');

  const [blur, setBlur] = useState(40);
  const [saturation, setSaturation] = useState(140);
  const [brightness, setBrightness] = useState(110);
  const [contrast, setContrast] = useState(105);
  const [opacity, setOpacity] = useState(0.25);
  const [shadowY, setShadowY] = useState(20);
  const [shadowBlur, setShadowBlur] = useState(40);
  const [shadowAlpha, setShadowAlpha] = useState(0.25);

  const glassStyle = useMemo<React.CSSProperties>(
    () => ({
      backdropFilter: `blur(${blur}px) saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%)`,
      WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%) brightness(${brightness}%) contrast(${contrast}%)`,
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      boxShadow: `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha})`,
    }),
    [blur, saturation, brightness, contrast, opacity, shadowY, shadowBlur, shadowAlpha]
  );

  return (
    <div>
      <Container size="xlarge" padding="lg">
        <h1>Refract</h1>
        <p style={{ color: 'var(--color-primary)' }}>
          Adjust the sliders below to tweak the glassmorphism effect in real time.
        </p>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'flex-start' }}>
          <Container size="medium" padding="md" style={{ flexShrink: 0 }}>
            <Slider
              label="Blur (px)"
              min={0}
              max={120}
              step={1}
              value={blur}
              onChange={setBlur}
            />
            <Slider
              label="Saturation (%)"
              min={50}
              max={250}
              step={1}
              value={saturation}
              onChange={setSaturation}
            />
            <Slider
              label="Brightness (%)"
              min={50}
              max={200}
              step={1}
              value={brightness}
              onChange={setBrightness}
            />
            <Slider
              label="Contrast (%)"
              min={50}
              max={200}
              step={1}
              value={contrast}
              onChange={setContrast}
            />
            <Slider
              label="Opacity"
              min={0}
              max={100}
              step={1}
              value={Math.round(opacity * 100)}
              onChange={(v) => setOpacity(v / 100)}
              formatValue={(v) => `${(v / 100).toFixed(2)}`}
            />
            <Slider
              label="Shadow Offset Y (px)"
              min={-40}
              max={80}
              step={1}
              value={shadowY}
              onChange={setShadowY}
            />
            <Slider
              label="Shadow Blur (px)"
              min={0}
              max={120}
              step={1}
              value={shadowBlur}
              onChange={setShadowBlur}
            />
            <Slider
              label="Shadow Alpha"
              min={0}
              max={100}
              step={1}
              value={Math.round(shadowAlpha * 100)}
              onChange={(v) => setShadowAlpha(v / 100)}
              formatValue={(v) => `${(v / 100).toFixed(2)}`}
            />
          </Container>

          <Container
            size="large"
            padding="lg"
            glass={true}
            style={{
              backgroundImage: 'url(/assets/f8.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              flex: 1,
            }}
          >
            <Container
              size="large"
              padding="lg"
              glass={true}
              style={{
                ...glassStyle,
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
              {/* blank div so cursor stops complaining*/}
              </div>
            </Container>
          </Container>
        </div>
        <div
          style={{
            marginTop: '1rem',
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--color-surface-alt)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflowX: 'auto',
          }}
        >
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: 'var(--color-on-surface)',
            }}
          >
            Current CSS:
          </h3>
          <pre
            style={{
              margin: 0,
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              color: 'var(--color-on-surface-alt)',
              whiteSpace: 'pre',
              overflowX: 'auto',
            }}
          >
            <code>{`.glass {
  backdrop-filter: blur(${blur}px)
                  saturate(${saturation}%)
                  brightness(${brightness}%)
                  contrast(${contrast}%);
  -webkit-backdrop-filter: blur(${blur}px)
                           saturate(${saturation}%)
                           brightness(${brightness}%)
                           contrast(${contrast}%);
  background-color: rgba(255, 255, 255, ${opacity});
  box-shadow: 0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha});
}`}</code>
          </pre>
        </div>
        
      </Container>
    </div>
  );
}