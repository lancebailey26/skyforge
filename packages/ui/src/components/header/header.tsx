'use client';

import { ReactNode, useState, Children } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Navigation, NavigationProps } from './navigation/navigation';
import styles from './header.module.css';

export interface HeaderProps {
  title?: string;
  navigation?: NavigationProps;
  actions?: ReactNode;
  className?: string;
}

export function Header(props: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (item: NavigationProps['items'][0]) => {
    setIsMobileMenuOpen(false);
    if(item.onClick) {
      item.onClick();
    }
  };

  return (
    <>
      <header className={`${styles.header} ${props.className || ''}`}>
        <div className={styles.container}>
          {props.title && (
            <a href="/" className={styles.title}>
              {props.title}
            </a>
          )}

          {(props.navigation || props.actions) && (
            <button
              type="button"
              className={styles.mobileMenuButton}
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} />
            </button>
          )}

          {props.navigation && (
            <Navigation {...props.navigation} className={styles.desktopNav} />
          )}

          {props.actions && <div className={styles.actions}>{props.actions}</div>}
        </div>

        {(props.navigation || props.actions) && isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            {props.navigation && (
              <nav className={styles.mobileNav}>
                <ul className={styles.mobileNavList}>
                  {props.navigation.items.map((item, index) => (
                    <li key={index} className={styles.mobileNavItem}>
                      {item.href ?
                        (
                          <a
                            href={item.href}
                            className={styles.mobileNavLink}
                            onClick={() => handleNavClick(item)}
                          >
                            {item.label}
                          </a>
                        ) :
                        (
                          <button
                            type="button"
                            className={styles.mobileNavLink}
                            onClick={() => handleNavClick(item)}
                          >
                            {item.label}
                          </button>
                        )}
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {props.actions && (
              <div className={styles.mobileActions}>
                {Children.map(Children.toArray(props.actions), (action, index) => (
                  <div key={index} className={styles.mobileActionItem}>
                    {action}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
      {(props.navigation || props.actions) && isMobileMenuOpen && (
        <div
          className={styles.backdrop}
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}