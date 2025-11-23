'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from './button.module.css';
import { useRef, MouseEvent } from 'react';

interface ButtonProps {
  icon?: IconProp,
  text?: string,
  size?: 'tiny' | 'small' | 'medium' | 'large',
  disabled?: boolean,
  color?: 'primary' | 'secondary' | 'tertiary' | 'error',
  subColor?: 'filled' | 'tonal' | 'outline' | 'surface' | 'clear' | 'underline',
  onClick?: (evt: MouseEvent<HTMLButtonElement>) => void,
  className?: string,
  style?: React.CSSProperties,
  tabbable?: boolean,
  attributes?: React.ButtonHTMLAttributes<HTMLButtonElement> & { [key: `data-${string}`]: unknown }
}

export function Button(props: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const color = props.color ?? 'primary';
  const subColor = props.subColor ?? 'filled';

  const handleClick = (evt: MouseEvent<HTMLButtonElement>) => {
    ref.current?.blur();
    if(props.onClick) {
      props.onClick(evt);
    }
  };

  return (
    <button 
      className={`
        ${styles.button} 
        ${props.size ? styles[props.size] : ''} 
        ${color} ${subColor} 
        ${!props.text ? styles.noText : ''} 
        ${props.className ?? ''} 
        ${!props.onClick ? styles.noHover : ''}
      `} 
      onClick={handleClick} 
      disabled={props.disabled} 
      ref={ref} 
      style={props.style} 
      tabIndex={props.tabbable === false ? -1 : 1}
      {...props.attributes}
    >
      {props.icon && <FontAwesomeIcon icon={props.icon} className={styles.icon} />}
      <p>{props.text}</p>
    </button>
  );
}