'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from './button.module.css';
import { forwardRef, MouseEvent } from 'react';

export interface ButtonProps {
  icon?: IconProp;
  text?: string;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'tertiary' | 'error';
  subColor?: 'filled' | 'tonal' | 'outline' | 'surface' | 'clear' | 'underline';
  onClick?: (evt: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  tabbable?: boolean;
  attributes?: React.ButtonHTMLAttributes<HTMLButtonElement> & { [key: `data-${string}`]: unknown };
  type?: 'link';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const color = props.color ?? 'primary';
  const subColor =
    props.subColor ?? (props.type === 'link' ? 'underline' : 'filled');
  const rawAttrs = props.attributes ?? {};
  const { type: attrType, tabIndex: attrTabIndex, ...restAttributes } = rawAttrs;
  const buttonType =
    attrType === 'submit' || attrType === 'reset' ? attrType : 'button';

  const handleClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.currentTarget.blur();
    props.onClick?.(evt);
  };

  const tabIndex =
    props.tabbable === false ? -1 : attrTabIndex ?? undefined;

  return (
    <button
      type={buttonType}
      className={`
        ${styles.button}
        ${styles.uiTransition}
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
      tabIndex={tabIndex}
      {...restAttributes}
    >
      {props.icon && <FontAwesomeIcon icon={props.icon} className={styles.icon} aria-hidden />}
      {props.text ? <span className={styles.label}>{props.text}</span> : null}
    </button>
  );
});