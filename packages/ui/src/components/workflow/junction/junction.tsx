'use client';
import { forwardRef, useMemo } from 'react';
import styles from './junction.module.css';

export interface JunctionProps {
  id: string;
  inputCount: number;
  outputCount: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Junction = forwardRef<HTMLDivElement, JunctionProps>(
  ({ id, inputCount, outputCount, className, style }, ref) => {
    const displayText = useMemo(() => {
      return `${inputCount} in | ${outputCount} out`;
    }, [inputCount, outputCount]);

    return (
      <div
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

