'use client';

import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import styles from './floating-action-link.module.css';

export interface FloatingActionLinkProps {
  href: string;
  /** Visible text next to the icon. Omit for a circular icon-only control (use `ariaLabel`). */
  label?: string;
  /** Accessible name; defaults to `label` when `label` is set. */
  ariaLabel?: string;
  icon?: IconProp;
  className?: string;
  style?: CSSProperties;
}

export function FloatingActionLink(props: FloatingActionLinkProps) {
  const {
    href,
    label,
    ariaLabel,
    icon = faEnvelope as IconProp,
    className,
    style,
  } = props;

  const resolvedAria = ariaLabel ?? label ?? 'Open link';
  const iconOnly = !label;

  return (
    <a
      href={href}
      className={[styles.root, iconOnly ? styles.iconOnly : '', className ?? ''].filter(Boolean).join(' ')}
      style={style}
      aria-label={resolvedAria}
    >
      <FontAwesomeIcon icon={icon} className={styles.icon} aria-hidden />
      {label ? <span className={styles.label}>{label}</span> : null}
    </a>
  );
}