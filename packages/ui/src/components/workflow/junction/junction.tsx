'use client';
import { forwardRef, useMemo } from 'react';
import styles from './junction.module.css';

export interface JunctionProps {
  id: string;
  inputCount: number;
  outputCount: number;
  className?: string;
  style?: React.CSSProperties;
  /** DOM `id` on the root element (distinct from workflow node `id`). */
  rootId?: string;
}

export const Junction = forwardRef<HTMLDivElement, JunctionProps>(
  ({ id, inputCount, outputCount, className, style, rootId }, ref) => {
    const displayText = useMemo(() => {
      return `${inputCount} in | ${outputCount} out`;
    }, [inputCount, outputCount]);

    return (
      <div
        id={rootId}
        ref={ref}
        className={`${styles.junction} ${className || ''}`}
        style={style}
        data-node-id={id}
        data-node-type="junction"
      >
        <span className={styles.text}>{displayText}</span>
      </div>
    );
  }
);

Junction.displayName = 'Junction';