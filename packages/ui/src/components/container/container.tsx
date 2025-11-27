'use client';
import React from 'react';
import styles from './container.module.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glass?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  attributes?: React.HTMLAttributes<HTMLDivElement> & { [key: `data-${string}`]: unknown };
}

export function Container(props: ContainerProps) {
  const size = props.size ?? 'medium';
  const padding = props.padding ?? 'md';

  const glassStyles = props.glass ?
    {
      WebkitBackdropFilter: 'blur(100px) saturate(180%)',
      backdropFilter: 'blur(100px) saturate(180%)',
    } :
    {};

  return (
    <div
      className={`
        ${styles.container}
        ${styles[size]}
        ${styles[padding]}
        ${props.glass ? styles.glass : ''}
        ${props.className ?? ''}
      `}
      style={{ ...glassStyles, ...props.style }}
      {...props.attributes}
    >
      {props.children}
    </div>
  );
}