'use client';
import type React from 'react';
import { useMemo } from 'react';
import styles from './slider.module.css';

interface SliderProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
  style?: React.CSSProperties;
  attributes?: React.InputHTMLAttributes<HTMLInputElement> & { [key: `data-${string}`]: unknown };
}

export function Slider(props: SliderProps) {
  const {
    label,
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    showValue = true,
    formatValue,
    className,
    style,
    attributes,
  } = props;

  const displayValue = useMemo(
    () => (formatValue ? formatValue(value) : value.toString()),
    [value, formatValue]
  );

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} style={style}>
      {label && (
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          {showValue && <span className={styles.currentValue}>{displayValue}</span>}
        </div>
      )}
      <div className={styles.controlRow}>
        <input
          type="range"
          className={styles.range}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          {...attributes}
        />
      </div>
    </div>
  );
}