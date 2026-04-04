'use client';
import { useRef, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Toggle } from '../../toggle/toggle';
import styles from './node.module.css';

export interface WorkflowNodeProps {
  id: string;
  label: string;
  icon?: IconProp;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  variant?: 'input' | 'output';
  className?: string;
  style?: React.CSSProperties;
}

export const WorkflowNode = forwardRef<HTMLDivElement, WorkflowNodeProps>(
  ({ id, label, icon, enabled, onToggle, variant = 'input', className, style }, ref) => {

    return (
      <div
        ref={ref}
        className={`${styles.node} ${styles[variant]} ${className || ''}`}
        style={style}
        data-node-id={id}
        data-node-variant={variant}
        data-node-type="workflow-node"
      >
        {icon && (
          <div className={styles.icon}>
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
        <span className={styles.label}>{label}</span>
        <Toggle
          checked={enabled}
          onChange={(checked) => onToggle(checked)}
          size="small"
        />
      </div>
    );
  }
);

WorkflowNode.displayName = 'WorkflowNode';

