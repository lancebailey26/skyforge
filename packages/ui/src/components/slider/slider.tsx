'use client';
import type React from 'react';
import { useMemo, useId } from 'react';
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
  /** When set, used as the range input `id` (otherwise a stable generated id is used). */
  id?: string;
  /** `id` on the outer wrapper. */
  wrapperId?: string;
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
    id: inputId,
    wrapperId,
  } = props;

  const displayValue = useMemo(
    () => (formatValue ? formatValue(value) : value.toString()),
    [value, formatValue]
  );

  const reactId = useId();
  const rangeId = inputId ?? `slider-${reactId.replace(/:/g, '')}`;

  return (
    <div
      id={wrapperId}
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      style={style}
    >
      {label && (
        <div className={styles.header}>
          <label className={styles.label} htmlFor={rangeId}>
            {label}
          </label>
          {showValue && (
            <span className={styles.currentValue} aria-live="polite">
              {displayValue}
            </span>
          )}
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
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
          {...attributes}
          id={rangeId}
        />
      </div>
    </div>
  );
}