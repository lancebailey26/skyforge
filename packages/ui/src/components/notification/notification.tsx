'use client';
import styles from './notification.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
interface NotificationProps {
    title: string;
    description: string;
    icon?: IconProp;
    type?: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    timeout?: number;
    attributes?: React.HTMLAttributes<HTMLDivElement> & { [key: `data-${string}`]: unknown };
    visible?: boolean;
    showProgressBar?: boolean;
    progressBarValue?: number;
    progressBarMax?: number;
}

export function Notification(props: NotificationProps) {
    const { timeout, onClose } = props;
    const [isVisible, setIsVisible] = useState(props.visible ?? true);
    const [isMounted, setIsMounted] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isFadingIn, setIsFadingIn] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        requestAnimationFrame(() => {
            setIsFadingIn(true);
        });
    }, []);

    useEffect(() => {
        if(timeout && isMounted) {
            let removeTimeout: NodeJS.Timeout | null = null;
            const fadeOutTimeout = setTimeout(() => {
                setIsFadingOut(true);
                removeTimeout = setTimeout(() => {
                    setIsVisible(false);
                    onClose();
                }, 300);
            }, timeout);
            return () => {
                clearTimeout(fadeOutTimeout);
                if(removeTimeout) {
                    clearTimeout(removeTimeout);
                }
            };
        }
    }, [timeout, isMounted, onClose]);

    const handleClose = () => {
        setIsFadingOut(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    if(!isMounted || typeof document === 'undefined' || !document.body) {
        return null;
    }

    const notificationClass = `${styles.notification} ${styles[props.type ?? 'info']} ${
        isFadingIn ? styles.fadingIn : ''
    } ${isFadingOut ? styles.fadingOut : ''} ${props.className ?? ''}`;

    return createPortal(
        isVisible && <div
            ref={notificationRef}
            className={notificationClass}
            style={props.style}
            onClick={props.onClick}
            {...props.attributes}
        >
            <div className={styles.notificationHeader}>
                <div className={styles.iconAndTitle}>
                    {props.icon && <FontAwesomeIcon icon={props.icon} className={styles.icon} />}
                    <h3 className={styles.title}>{props.title}</h3>
                </div>
                <div 
                    className={styles.closeButton} 
                    onClick={handleClose} 
                    role="button"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
            <div className={`${styles.content} ${props.type ? styles[props.type] : styles.info}`}>
                <p className={styles.description}>{props.description}</p>
            </div>
        </div>,
        document.body
    );
}