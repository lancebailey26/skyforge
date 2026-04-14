'use client';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './processing-node.module.css';

export interface ProcessingNodeProps {
  id: string;
  label: string;
  variant?: 'customized' | 'add';
  onClick?: () => void;
  /** Double-click the label to edit when provided. */
  onLabelChange?: (label: string) => void;
  icon?: IconProp;
  className?: string;
  style?: React.CSSProperties;
  /** DOM `id` on the root element (distinct from workflow node `id`). */
  rootId?: string;
}

export const ProcessingNode = forwardRef<HTMLDivElement, ProcessingNodeProps>(
  ({ id, label, variant = 'add', onClick, onLabelChange, icon, className, style, rootId }, ref) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(label);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setDraft(label);
    }, [label]);

    useEffect(() => {
      if(editing) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [editing]);

    const commit = useCallback(() => {
      const next = draft.trim();
      if(next && next !== label) {
        onLabelChange?.(next);
      }
      setEditing(false);
    }, [draft, label, onLabelChange]);

    const cancel = useCallback(() => {
      setDraft(label);
      setEditing(false);
    }, [label]);

    const displayIcon = variant === 'customized' ? 
      (icon || faCheck) :
      icon;

    const iconActivatesClick = Boolean(onClick && onLabelChange);

    return (
      <div
        id={rootId}
        ref={ref}
        className={`${styles.node} ${styles[variant]} ${onClick ? styles.clickable : ''} ${className || ''}`}
        style={style}
        onClick={iconActivatesClick ? undefined : onClick}
        data-node-id={id}
        data-node-type="processing-node"
        role={onClick && !iconActivatesClick ? 'button' : undefined}
        tabIndex={onClick && !iconActivatesClick ? 0 : undefined}
        onKeyDown={(e) => {
          if(!onClick || iconActivatesClick) {
            return;
          }
          if(e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {displayIcon && (
          <div
            className={`${styles.icon} nodrag`}
            role={iconActivatesClick ? 'button' : undefined}
            tabIndex={iconActivatesClick ? 0 : undefined}
            onClick={
              iconActivatesClick && onClick ?
                (e) => {
                    e.stopPropagation();
                    onClick();
                  } :
                undefined
            }
            onKeyDown={
              iconActivatesClick && onClick ?
                (e) => {
                    if(e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onClick();
                    }
                  } :
                undefined
            }
          >
            <FontAwesomeIcon icon={displayIcon} />
          </div>
        )}
        {editing && onLabelChange ?
          <input
            ref={inputRef}
            className={`${styles.labelInput} nodrag nopan`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              e.stopPropagation();
              if(e.key === 'Enter') {
                e.preventDefault();
                commit();
              }
              if(e.key === 'Escape') {
                e.preventDefault();
                cancel();
              }
            }}
            aria-label="Node name"
          /> :
        (
          <span
            className={`${styles.label} nodrag`}
            onDoubleClick={(e) => {
              if(!onLabelChange) {
                return;
              }
              e.stopPropagation();
              e.preventDefault();
              setEditing(true);
            }}
            title={onLabelChange ? 'Double-click to rename' : undefined}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
);

ProcessingNode.displayName = 'ProcessingNode';