'use client';

import { ReactNode } from 'react';
import { Navigation, NavigationProps } from './navigation/navigation';
import styles from './header.module.css';

export interface HeaderProps {
  title?: string;
  navigation?: NavigationProps;
  actions?: ReactNode;
  className?: string;
}

export function Header(props: HeaderProps) {
  return (
    <header className={`${styles.header} ${props.className || ''}`}>
      <div className={styles.container}>
        {props.title && <h1 className={styles.title}>{props.title}</h1>}
        {props.navigation && <Navigation {...props.navigation} />}
        {props.actions && <div className={styles.actions}>{props.actions}</div>}
      </div>
    </header>
  );
}