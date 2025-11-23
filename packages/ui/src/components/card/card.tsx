'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../button/button';
import styles from './card.module.css';

interface HeaderControl {
    icon: IconProp;
    onClick: () => void;
    ariaLabel?: string;
}

interface CardProps {
    tagline?: string;
    description?: string;
    title?: string;
    subject: string | { src: string; alt?: string } | { color: string } | React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    subjectStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    captionStyle?: React.CSSProperties;
    footerStyle?: React.CSSProperties;
    overlayStyle?: React.CSSProperties;
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    mode?: 'inlaid' | 'popup';
    closeable?: boolean;
    onClose?: () => void;
    onClick?: () => void;
    container?: HTMLElement | null;
    captionAlign?: 'center' | 'left' | 'right';
    titleAlign?: 'center' | 'left';
    headerControls?: HeaderControl[];
    maxDescriptionLength?: number;
}

export function Card(props: CardProps) {
    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const mode = props.mode ?? 'inlaid';
    const isPopup = mode === 'popup';
    const closeable = props.closeable ?? isPopup;
    const captionAlign = props.captionAlign ?? 'center';
    const titleAlign = props.titleAlign ?? 'left';
    const maxLength = props.maxDescriptionLength ?? 150;
    
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const shouldTruncate = props.description ? props.description.length > maxLength : false;
    const displayDescription = shouldTruncate && !isExpanded && props.description ?
        `${props.description.substring(0, maxLength)}...` :
        props.description;

    const handleClose = () => {
        setMounted(false);
        if(props.onClose) {
            props.onClose();
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if(e.target === e.currentTarget) {
            setMounted(false);
            if(props.onClose) {
                props.onClose();
            }
        }
    };

    const isSubjectImage = typeof props.subject === 'object' && props.subject !== null && 'src' in props.subject;
    const isSubjectColor = typeof props.subject === 'object' && props.subject !== null && 'color' in props.subject && !('src' in props.subject);
    const isSubjectComponent = typeof props.subject !== 'string' && !isSubjectImage && !isSubjectColor && props.subject !== null;

    const subjectStyle = isSubjectColor && typeof props.subject === 'object' && props.subject !== null && 'color' in props.subject ?
        { backgroundColor: props.subject.color } :
        undefined;


    const cardElement = (
        <div
            className={`
                ${styles.card}
                ${isPopup ? styles.popup : ''}
                ${props.className ?? ''} 
                ${styles[props.size ?? 'medium']}
                ${props.onClick ?
                  styles.clickable :
                  ''}
            `}
            style={props.style}
            onClick={props.onClick}
            role={props.onClick ? 'button' : undefined}
            tabIndex={props.onClick ? 0 : undefined}
            onKeyDown={props.onClick ?
              (e) => {
                if(e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  props.onClick?.();
                }
              } :
              undefined}
        >
            {(closeable || props.title || props.headerControls) && (
                <div
                    className={`
                        ${styles.header} 
                        ${styles[`titleAlign${titleAlign.charAt(0).toUpperCase() + titleAlign.slice(1)}`]}
                        ${props.headerControls?.length || closeable ? styles.headerWithControls : ''}
                    `}
                    style={props.headerStyle}
                >
                    {props.title && (
                        <h3 className={styles.title}>{props.title}</h3>
                    )}
                    {(props.headerControls?.length || closeable) && (
                        <div className={styles.headerControls}>
                            {props.headerControls?.map((control, index) => (
                                <Button
                                    key={index}
                                    icon={control.icon}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        control.onClick();
                                    }}
                                    size="tiny"
                                    subColor="clear"
                                    className={styles.headerControlButton}
                                    attributes={{
                                        'aria-label': control.ariaLabel ?? 'Action',
                                        ...({} as { [key: `data-${string}`]: unknown })
                                    }}
                                />
                            ))}
                            {closeable && (
                                <Button
                                    icon={faXmark as IconProp}
                                    text=""
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleClose();
                                    }}
                                    size="tiny"
                                    subColor="clear"
                                    className={styles.headerControlButton}
                                    attributes={{
                                        'aria-label': 'Close',
                                        ...({} as { [key: `data-${string}`]: unknown })
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
            <div
                className={`
                    ${styles.subject} 
                    ${(closeable || props.title) ? styles.subjectWithHeader : ''} 
                    ${isSubjectComponent ? styles.subjectComponent : ''}
                `}
                style={{ ...subjectStyle, ...props.subjectStyle }}
            >
                {typeof props.subject === 'string' ?
                    (
                        <div className={styles.textSubject}>
                            {props.subject}
                        </div>
                    ) :
                    isSubjectImage && typeof props.subject === 'object' && props.subject !== null ?
                        (
                            <img
                                src={'src' in props.subject ? props.subject.src : ''}
                                alt={'alt' in props.subject ? props.subject.alt ?? '' : ''}
                                className={styles.image}
                            />
                        ) :
                        isSubjectColor ?
                            null :
                            isSubjectComponent ?
                                (props.subject as React.ReactNode) :
                                null
                }
            </div>
            <div
                className={`
                    ${styles.caption} 
                    ${styles[captionAlign]} 
                    ${props.description ? styles.captionWithDescription : ''}
                `}
                style={props.captionStyle}
            >
                <h3 className={styles.tagline}>{props.tagline}</h3>
                {props.description && (
                    <>
                        <p className={styles.description}>{displayDescription}</p>
                        {shouldTruncate && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }}
                                className={styles.expandButton}
                                aria-label={isExpanded ? 'Show less' : 'Show more'}
                            >
                                {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </>
                )}
            </div>
            {props.footer && (
                <div className={styles.footer} style={props.footerStyle}>
                    {props.footer}
                </div>
            )}
        </div>
    );

    const cardContent = isPopup ?
        (
            <div
                className={styles.overlay}
                onClick={handleOverlayClick}
                style={props.overlayStyle}
            >
                {cardElement}
            </div>
        ) :
        cardElement;

    if(!mounted) {
        return null;
    }

    if(isPopup) {
        const container = props.container ?? (typeof document !== 'undefined' ? document.body : null);
        if(container) {
            return createPortal(cardContent, container);
        }
    }

    return cardContent;
}