'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from './button.module.css';
import { forwardRef, MouseEvent } from 'react';

export interface ButtonProps {
  icon?: IconProp;
  text?: string;
  /** Rounded pill (default) or perfect circle. Circle applies with `icon` and no `text` (icon-only control). */
  shape?: 'pill' | 'circle';
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
  id?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const color = props.color ?? 'primary';
  const subColor =
    props.subColor ?? (props.type === 'link' ? 'underline' : 'filled');
  const rawAttrs = props.attributes ?? {};
  const { type: attrType, tabIndex: attrTabIndex, ...restAttributes } = rawAttrs;
  const buttonType =
    attrType === 'submit' || attrType === 'reset' ? attrType : 'button';

  /* Submit/reset rely on native form actions; they must stay clickable without onClick. */
  const useNoHover =
    !props.onClick && buttonType !== 'submit' && buttonType !== 'reset';

  const handleClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.currentTarget.blur();
    props.onClick?.(evt);
  };

  const tabIndex =
    props.tabbable === false ? -1 : attrTabIndex ?? undefined;

  const shape = props.shape ?? 'pill';
  const iconOnly = !props.text;
  const showCircle = shape === 'circle' && props.icon && iconOnly;

  return (
    <button
      type={buttonType}
      className={`
        ${styles.button}
        ${styles.uiTransition}
        ${props.size ? styles[props.size] : ''}
        ${color} ${subColor}
        ${iconOnly ? styles.noText : ''}
        ${showCircle ? styles.circle : ''}
        ${props.className ?? ''}
        ${useNoHover ? styles.noHover : ''}
      `}
      onClick={handleClick}
      disabled={props.disabled}
      ref={ref}
      style={props.style}
      tabIndex={tabIndex}
      {...restAttributes}
      id={props.id}
    >
      {props.icon && <FontAwesomeIcon icon={props.icon} className={styles.icon} aria-hidden />}
      {props.text ? <span className={styles.label}>{props.text}</span> : null}
    </button>
  );
});