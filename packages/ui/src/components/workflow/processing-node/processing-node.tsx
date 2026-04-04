'use client';
import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './processing-node.module.css';

export interface ProcessingNodeProps {
  id: string;
  label: string;
  variant?: 'customized' | 'add';
  onClick?: () => void;
  icon?: IconProp;
  className?: string;
  style?: React.CSSProperties;
}

export const ProcessingNode = forwardRef<HTMLDivElement, ProcessingNodeProps>(
  ({ id, label, variant = 'add', onClick, icon, className, style }, ref) => {
    const displayIcon = variant === 'customized' 
      ? (icon || faCheck)
      : icon;

    return (
      <div
        ref={ref}
        className={`${styles.node} ${styles[variant]} ${onClick ? styles.clickable : ''} ${className || ''}`}
        style={style}
        onClick={onClick}
        data-node-id={id}
        data-node-type="processing-node"
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {displayIcon && (
          <div className={styles.icon}>
            <FontAwesomeIcon icon={displayIcon} />
          </div>
        )}
        <span className={styles.label}>{label}</span>
      </div>
    );
  }
);

ProcessingNode.displayName = 'ProcessingNode';

