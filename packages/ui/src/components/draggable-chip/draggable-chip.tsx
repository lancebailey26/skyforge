'use client';

import { forwardRef } from 'react';
import styles from './draggable-chip.module.css';

/** Storybook may pass `"true"` / `"false"` strings for booleans. */
function coerceBoolean(value: unknown, defaultValue: boolean): boolean {
  if (value === true || (typeof value === 'string' && value.toLowerCase() === 'true')) return true;
  if (value === false || (typeof value === 'string' && value.toLowerCase() === 'false')) return false;
  if (value === undefined || value === null) return defaultValue;
  return defaultValue;
}

export type DraggableChipTone = 'primary' | 'secondary' | 'tertiary' | 'error';
export type DraggableChipFill = 'filled' | 'tonal' | 'outline' | 'surface' | 'clear';

export interface DraggableChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  text?: string;
  /** @default 'primary' */
  tone?: DraggableChipTone;
  /** @default 'filled' */
  fill?: DraggableChipFill;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  /** @default true */
  elongated?: boolean;
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
}

export const DraggableChip = forwardRef<HTMLDivElement, DraggableChipProps>(function DraggableChip(
  {
    id,
    text,
    children,
    className,
    style,
    tone = 'primary',
    fill = 'filled',
    size = 'medium',
    elongated: elongatedProp = true,
    labelClassName,
    labelStyle,
    ...rest
  },
  ref,
) {
  const content = children ?? text;
  const elongated = coerceBoolean(elongatedProp, true);

  return (
    <div
      id={id}
      ref={ref}
      className={`
        ${styles.root}
        ${styles.uiTransition}
        ${styles[size]}
        ${elongated ? styles.elongated : ''}
        ${tone} ${fill}
        ${className ?? ''}
      `}
      style={style}
      {...rest}
    >
      {content != null && content !== false ? (
        <span className={`${styles.label} ${labelClassName ?? ''}`} style={labelStyle}>
          {content}
        </span>
      ) : null}
    </div>
  );
});
