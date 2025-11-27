'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from './iconbar.module.css';

export interface IconItem {
  icon: IconProp;
  href: string;
  ariaLabel: string;
  size?: number | string;
  style?: React.CSSProperties;
}

interface IconBarProps {
  icons: IconItem[];
  size?: 'tiny' | 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'info' | 'success';
  className?: string;
  style?: React.CSSProperties;
  gap?: number | string;
}

export function IconBar({ icons, size = 'medium', color = 'primary', className, style, gap }: IconBarProps) {
  if(!icons || icons.length === 0) {
    return null;
  }

  const containerStyle = {
    ...(gap && { gap }),
    ...style
  };

  return (
    <div 
      className={`${styles.iconBar} ${styles[size]} ${styles[color]} ${className || ''}`}
      style={containerStyle}
    >
      {icons.map((item, index) => (
        <a 
          key={index}
          href={item.href} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.iconLink}
          style={item.style}
          aria-label={item.ariaLabel}
        >
          <FontAwesomeIcon 
            icon={item.icon} 
            className={styles.icon}
            style={item.size ? { fontSize: item.size } : undefined}
          />
        </a>
      ))}
    </div>
  );
}