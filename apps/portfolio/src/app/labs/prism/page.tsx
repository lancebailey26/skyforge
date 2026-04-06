'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Input, Button } from '@lancebailey26/skyforge-ui';
import { useTitle } from '@/hooks/useTitle';
import { LabPageChrome } from '@/components/labs/LabPageChrome';
import { metadata } from './metadata';

const INITIAL_COLOR = '#0084ff';

function normalizeHexForApi(value: string): string | null {
  let h = value.trim();
  if(h.length === 0)return null;
  if(!h.startsWith('#')) h = `#${h}`;
  if(/^#[0-9A-Fa-f]{6}$/i.test(h))return h.toLowerCase();
  if(/^#[0-9A-Fa-f]{3}$/i.test(h)) {
    const r = h[1];
    const g = h[2];
    const b = h[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

export default function PrismPage() {
  const [baseColor, setBaseColor] = useState(INITIAL_COLOR);
  const [palette, setPalette] = useState<{ color: string; name: string; humanName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const lastFetchedColorRef = useRef<string | null>(null);
  useTitle('Prism - Labs');

  const fetchPalette = useCallback(async (color: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/palette?color=${encodeURIComponent(color)}`);
      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.error || 'Failed to generate palette');
      }

      setPalette(data.palette || []);
      lastFetchedColorRef.current = color.toLowerCase();
    } catch(err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPalette([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPalette(INITIAL_COLOR);
  }, [fetchPalette]);

  useEffect(() => {
    const el = colorInputRef.current;
    if(!el)return;
    const onPickerCommit = () => {
      void fetchPalette(el.value);
    };
    el.addEventListener('change', onPickerCommit);
    return () => el.removeEventListener('change', onPickerCommit);
  }, [fetchPalette]);

  const handleColorChange = (value: string) => {
    const normalized = value.startsWith('#') ? value : `#${value}`;
    setBaseColor(normalized);
  };

  const handleHexBlur = (value: string) => {
    const apiHex = normalizeHexForApi(value);
    if(!apiHex || apiHex === lastFetchedColorRef.current)return;
    setBaseColor(apiHex);
    void fetchPalette(apiHex);
  };

  const handleGenerate = () => {
    const apiHex = normalizeHexForApi(baseColor);
    if(!apiHex)return;
    setBaseColor(apiHex);
    void fetchPalette(apiHex);
  };

  const handleColorPickerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value);
  };

  return (
    <LabPageChrome title={metadata.title} subtitle={metadata.description}>
      <div className="tech-marquee-stage">
        <p className="tech-marquee-stage-kicker">Pick a seed color</p>
        <div className="lab-control-row">
          <input
            ref={colorInputRef}
            type="color"
            value={baseColor}
            onChange={handleColorPickerInput}
            className="lab-color-swatch"
            aria-label="Pick base color"
          />
          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <Input
              label="Hex"
              type="text"
              value={baseColor}
              onChange={handleColorChange}
              onBlur={handleHexBlur}
              placeholder="#0084ff"
              style="fill"
            />
          </div>
          <Button
            text="Regenerate"
            onClick={handleGenerate}
            size="medium"
            color="primary"
            disabled={loading}
          />
        </div>

        {error ? <div className="lab-error-banner" role="alert">{error}</div> : null}

        {loading ? <div className="lab-loading">Building palette…</div> : null}

        {palette.length > 0 && !loading ?
          (
            <>
              <p className="tech-marquee-stage-kicker" style={{ marginTop: 'clamp(1rem, 2vh, 1.5rem)' }}>
                Palette
              </p>
              <div className="lab-palette-grid">
                {palette.map((item, index) => {
                  const displayName = item.name
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  const description = item.humanName ?
                    `${item.humanName} · ${item.color.toUpperCase()}` :
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
            </>
          ) :
          null}
      </div>
    </LabPageChrome>
  );
}