import { NextResponse } from 'next/server';

type Rgb = { r: number; g: number; b: number };
type Hsl = { h: number; s: number; l: number };
type PaletteColor = { color: string; name: string; humanName: string };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string): Rgb | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(!match)return null;

  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    `#${ 
    [r, g, b]
      .map((channel) => channel.toString(16).padStart(2, '0'))
      .join('')}`
  );
}

function rgbToHsl(r: number, g: number, b: number): Hsl {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if(delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch(max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      default:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  if(sNorm === 0) {
    const gray = Math.round(lNorm * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1 / 6)return p + (q - p) * 6 * t;
    if(t < 1 / 2)return q;
    if(t < 2 / 3)return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  const r = hue2rgb(p, q, hNorm + 1 / 3);
  const g = hue2rgb(p, q, hNorm);
  const b = hue2rgb(p, q, hNorm - 1 / 3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}
async function getColorHumanName(color: string): Promise<string> {
  if(!color)return '';
  try {
    const response = await fetch(`https://www.thecolorapi.com/id?hex=${color.replace('#', '')}`);
    if(!response.ok)return '';
    const data = await response.json();
    return data.name?.value || '';
  } catch{
    return '';
  }
}

async function generatePalette(baseColor: string): Promise<PaletteColor[]> {
  const rgb = hexToRgb(baseColor);
  if(!rgb)return [];

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const lightStep = l > 70 ? 8 : 14;
  const darkStep = l < 30 ? 8 : 14;
  const safeS = clamp(s, 20, 90);

  const primaryBase = hslToHex(h, safeS, clamp(l, 20, 80));
  const primaryLight = hslToHex(h, safeS * 0.8, clamp(l + lightStep, 20, 95));
  const primarySoft = hslToHex(h, safeS * 0.4, clamp(l + lightStep * 1.5, 25, 97));
  const primaryDark = hslToHex(h, safeS * 1.05, clamp(l - darkStep, 5, 60));

  const accentHue = (h + 30) % 360;
  const accent = hslToHex(accentHue, safeS, clamp(l, 20, 75));
  const accentSoft = hslToHex(accentHue, safeS * 0.6, clamp(l + lightStep, 30, 90));

  const neutral = hslToHex(h, clamp(safeS * 0.15, 5, 18), clamp(l, 30, 70));
  const neutralStrong = hslToHex(h, clamp(safeS * 0.25, 8, 26), clamp(l - darkStep, 15, 45));

  const complementHue = (h + 180) % 360;
  const complement = hslToHex(complementHue, clamp(safeS * 0.7, 30, 75), clamp(l, 25, 70));

  const colors = [
    { name: 'primary', color: primaryBase },
    { name: 'primary-light', color: primaryLight },
    { name: 'primary-soft', color: primarySoft },
    { name: 'primary-dark', color: primaryDark },
    { name: 'accent', color: accent },
    { name: 'accent-soft', color: accentSoft },
    { name: 'neutral', color: neutral },
    { name: 'neutral-strong', color: neutralStrong },
    { name: 'complement', color: complement },
  ];

  const paletteWithNames = await Promise.all(
    colors.map(async (item) => ({
      ...item,
      humanName: await getColorHumanName(item.color),
    }))
  );

  return paletteWithNames;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const color = searchParams.get('color');

  if(!color) {
    return NextResponse.json(
      { error: 'Color parameter is required. Example: ?color=#FF5733' },
      { status: 400 },
    );
  }

  const hexPattern = /^#?[0-9A-Fa-f]{6}$/;
  const normalizedColor = color.startsWith('#') ? color : `#${color}`;

  if(!hexPattern.test(normalizedColor)) {
    return NextResponse.json(
      { error: 'Invalid color format. Use 6-digit hex (e.g., #FF5733).' },
      { status: 400 },
    );
  }

  try {
    const palette = await generatePalette(normalizedColor);
    return NextResponse.json({ palette });
  } catch(error) {
    console.error('Error generating palette:', error);
    return NextResponse.json(
      { error: 'Failed to generate palette from the provided color.' },
      { status: 500 },
    );
  }
}