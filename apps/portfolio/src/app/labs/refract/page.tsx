'use client';

import { useState, useMemo } from 'react';
import { Slider } from '@lancebailey26/skyforge-ui';
import { useTitle } from '@/hooks/useTitle';
import { LabPageChrome } from '@/components/labs/LabPageChrome';
import { metadata } from './metadata';

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
      backgroundColor: `color-mix(in oklch, var(--color-surface) ${Math.round(opacity * 100)}%, transparent)`,
      boxShadow: `0 ${shadowY}px ${shadowBlur}px color-mix(in oklch, black ${Math.round(shadowAlpha * 100)}%, transparent)`,
    }),
    [blur, saturation, brightness, contrast, opacity, shadowY, shadowBlur, shadowAlpha]
  );

  const cssSnippet = `.glass {
  backdrop-filter: blur(${blur}px) saturate(${saturation}%)
    brightness(${brightness}%) contrast(${contrast}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%)
    brightness(${brightness}%) contrast(${contrast}%);
  background-color: color-mix(in oklch, var(--color-surface) ${Math.round(opacity * 100)}%, transparent);
  box-shadow: 0 ${shadowY}px ${shadowBlur}px color-mix(in oklch, black ${Math.round(shadowAlpha * 100)}%, transparent);
}`;

  return (
    <LabPageChrome title={metadata.title} subtitle={metadata.description}>
      <div className="lab-split">
        <div className="tech-marquee-stage">
          <p className="tech-marquee-stage-kicker">Parameters</p>
          <Slider label="Blur (px)" min={0} max={120} step={1} value={blur} onChange={setBlur} />
          <Slider label="Saturation (%)" min={50} max={250} step={1} value={saturation} onChange={setSaturation} />
          <Slider label="Brightness (%)" min={50} max={200} step={1} value={brightness} onChange={setBrightness} />
          <Slider label="Contrast (%)" min={50} max={200} step={1} value={contrast} onChange={setContrast} />
          <Slider
            label="Surface mix"
            min={0}
            max={100}
            step={1}
            value={Math.round(opacity * 100)}
            onChange={(v) => setOpacity(v / 100)}
            formatValue={(v) => `${(v / 100).toFixed(2)}`}
          />
          <Slider label="Shadow Y (px)" min={-40} max={80} step={1} value={shadowY} onChange={setShadowY} />
          <Slider label="Shadow blur (px)" min={0} max={120} step={1} value={shadowBlur} onChange={setShadowBlur} />
          <Slider
            label="Shadow depth"
            min={0}
            max={100}
            step={1}
            value={Math.round(shadowAlpha * 100)}
            onChange={(v) => setShadowAlpha(v / 100)}
            formatValue={(v) => `${(v / 100).toFixed(2)}`}
          />
        </div>

        <div className="lab-refract-preview-outer">
          <div className="lab-refract-preview-inner" style={glassStyle} />
        </div>
      </div>

      <div className="lab-code-shell">
        <h3>CSS</h3>
        <pre className="lab-code-block">
          <code>{cssSnippet}</code>
        </pre>
      </div>
    </LabPageChrome>
  );
}
