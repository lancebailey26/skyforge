'use client';

import styles from './navigation.module.css';

export interface NavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

export function Navigation(props: NavigationProps) {
  return (
    <nav className={`${styles.navigation} ${props.className || ''}`}>
      <ul className={styles.navList}>
        {props.items.map((item, index) => (
          <li key={index} className={styles.navItem}>
            {item.href ?
              (
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              ) :
              (
                <button
                  type="button"
                  className={styles.navLink}
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              )}
          </li>
        ))}
      </ul>
    </nav>
  );
}