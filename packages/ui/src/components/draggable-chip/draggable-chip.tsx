'use client';

import styles from './draggable-chip.module.css';
export type DraggableChipTone = 'primary' | 'secondary' | 'tertiary' | 'error';
export type DraggableChipFill = 'filled' | 'tonal' | 'outline' | 'surface' | 'clear';

export interface DraggableChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'ref'> {
  ref?: React.Ref<HTMLDivElement>;
  text?: string;
  /** @default 'primary' */
  tone?: DraggableChipTone;
  /** @default 'filled' */
  fill?: DraggableChipFill;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  elongated?: boolean;
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
}

export function DraggableChip(props: DraggableChipProps) {
  const {
    ref,
    id,
    text,
    children,
    className,
    style,
    tone = 'primary',
    fill = 'filled',
    size = 'medium',
    elongated,
    labelClassName,
    labelStyle,
    ...rest
  } = props;

  const content = children ?? text;

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
}
