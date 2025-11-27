'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, Input, Button, Container } from '@skyforge/ui';
import { useTitle } from '@/hooks/useTitle';

export default function PrismPage() {
  const [baseColor, setBaseColor] = useState('#0084ff');
  const [palette, setPalette] = useState<{ color: string; name: string; humanName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useTitle('Prism - Labs');

  const generatePalette = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/palette?color=${encodeURIComponent(baseColor)}`);
      const data = await response.json();
      
      if(!response.ok) {
        throw new Error(data.error || 'Failed to generate palette');
      }
      
      setPalette(data.palette || []);
    } catch(err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPalette([]);
    } finally {
      setLoading(false);
    }
  }, [baseColor]);

  useEffect(() => {
    generatePalette();
  }, [generatePalette]);

  const handleColorChange = (value: string) => {
    const normalized = value.startsWith('#') ? value : `#${value}`;
    setBaseColor(normalized);
  };

  const handleGenerate = () => {
    generatePalette();
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value);
  };

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
              Prism
            </h1>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              width: '100%'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px', flex: 1, }}>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center'
                }}>
                  <input
                    type="color"
                    value={baseColor}
                    onChange={handleColorPickerChange}
                    style={{
                      width: '60px',
                      height: '60px',
                      border: '2px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      backgroundColor: 'transparent'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <Input
                      label="Hex Color"
                      type="text"
                      value={baseColor}
                      onChange={handleColorChange}
                      placeholder="#0084ff"
                      style="fill"
                    />
                  </div>
                </div>
              </div>
              <Button
                text="Generate Palette"
                onClick={handleGenerate}
                size="medium"
                color="primary"
                disabled={loading}
              />
            </div>

            {error && (
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--color-danger)',
                color: 'var(--color-on-error)',
                borderRadius: 'var(--radius-md)',
                width: '100%'
              }}>
                {error}
              </div>
            )}

            {loading && (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--color-on-surface-alt)'
              }}>
                Generating palette...
              </div>
            )}

            {palette.length > 0 && !loading && (
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem'
                }}>
                  Generated Palette
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '1.5rem',
                  width: '100%'
                }}>
                  {palette.map((item, index) => {
                    const displayName = item.name
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    const description = item.humanName ?
                      `${item.humanName} • ${item.color.toUpperCase()}` :
                      item.color.toUpperCase();
                    return (
                      <Card
                        key={index}
                        title={displayName}
                        subject={{ color: item.color }}
                        description={description}
                        size="medium"
                        type="glass"
                        style={{ height: '100%' }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}