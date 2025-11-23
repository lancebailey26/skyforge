'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import styles from './tag.module.css';
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface TagProps {
    icon?: IconProp | React.ReactNode;
    text?: string
    color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning' | 'info' | 'success';
    size?: 'tiny' | 'small' | 'medium' | 'large';
    className?: string;
    style?: React.CSSProperties;
    attributes?: React.HTMLAttributes<HTMLDivElement> & { [key: `data-${string}`]: unknown };
    removable?: boolean;
    onRemove?: () => void;
    onClick?: () => void;
}

export function Tag(props: TagProps) {
    const isReactElement = props.icon && typeof props.icon === 'object' && 'type' in props.icon;
    return (
        <div
            className={`
                ${styles.tag}
                ${props.size ? styles[props.size] : styles.medium}
                ${props.className ?? ''}
                ${props.color ? styles[props.color] : ''}
            `}
            style={props.style}
            {...props.attributes}
            onClick={props.onClick}
        >
            {props.icon && (
                isReactElement ?
                    <span className={styles.icon}>{props.icon as React.ReactElement}</span> :
                    <FontAwesomeIcon icon={props.icon as IconProp} className={styles.icon} />
            )}
            {props.text && <span className={styles.text}>{props.text}</span>}
            {props.removable && (
                <FontAwesomeIcon 
                    icon={faXmark} 
                    className={styles.remove} 
                    onClick={(e) => {
                        e.stopPropagation();
                        props.onRemove?.();
                    }}
                />
            )}
        </div>
    );
}