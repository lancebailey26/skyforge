'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from './toggle.module.css';
import { useRef, ChangeEvent, useState, useEffect } from 'react';

interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, evt: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  iconOn?: IconProp;
  iconOff?: IconProp;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
  tabbable?: boolean;
  attributes?: React.InputHTMLAttributes<HTMLInputElement> & { [key: `data-${string}`]: unknown }
}

export function Toggle(props: ToggleProps) {
  const ref = useRef<HTMLInputElement>(null);
  const size = props.size ?? 'medium';
  const isControlled = props.checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(props.defaultChecked ?? false);
  
  const checked = isControlled ? props.checked : internalChecked;

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if(!isControlled) {
      setInternalChecked(evt.target.checked);
    }
    if(props.onChange) {
      props.onChange(evt.target.checked, evt);
    }
  };

  useEffect(() => {
    if(props.defaultChecked !== undefined && !isControlled) {
      setInternalChecked(props.defaultChecked);
    }
  }, [props.defaultChecked, isControlled]);

  return (
    <label 
      className={`
        ${styles.toggle} 
        ${styles[size]} 
        ${props.disabled ? styles.disabled : ''}
        ${props.className ?? ''}
      `}
      style={props.style}
    >
      <input
        type="checkbox"
        checked={isControlled ? props.checked : undefined}
        defaultChecked={!isControlled ? props.defaultChecked : undefined}
        onChange={handleChange}
        disabled={props.disabled}
        ref={ref}
        tabIndex={props.tabbable === false ? -1 : 0}
        className={styles.input}
        {...props.attributes}
      />
      <span className={styles.track}>
        <span className={styles.thumb}>
          {props.iconOn && checked && (
            <FontAwesomeIcon icon={props.iconOn} className={styles.icon} />
          )}
          {props.iconOff && !checked && (
            <FontAwesomeIcon icon={props.iconOff} className={styles.icon} />
          )}
        </span>
      </span>
      {props.label && (
        <span className={styles.label}>{props.label}</span>
      )}
    </label>
  );
}