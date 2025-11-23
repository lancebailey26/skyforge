'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './input.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
interface InputProps {
  label: string;
  placeholder?: string;
  initialValue?: string;
  value?: string;
  errored?: boolean;
  disabled?: boolean;
  style?: 'fill' | 'outline';
  type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'datetime-local';
  step?: string;
  min?: string;
  max?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  extraStyle?: React.CSSProperties;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  name?: string;
  attributes?: React.InputHTMLAttributes<HTMLInputElement> & { [key: `data-${string}`]: unknown };
  ref?: React.RefObject<HTMLInputElement | null>;
}

export function Input(props: InputProps) {
  const [hasFocus, setHasFocus] = useState(false);
  const [internalValue, setInternalValue] = useState(props.initialValue ?? '');
  const inputElem = useRef<HTMLInputElement>(null);
  const style = props.style ?? 'fill';
  const currentValue = props.value ?? internalValue;

  const handleFocus = () => {
    if(props.readOnly)return;
    setHasFocus(true);
    props.onFocus && props.onFocus(currentValue);
  };

  const handleBlur = () => {
    if(props.readOnly)return;
    setTimeout(() => {
      setHasFocus(false);
    }, 250);
    props.onBlur && props.onBlur(currentValue);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(props.readOnly)return;
    setInternalValue(event.target.value);
    props.onChange && props.onChange(event.target.value);
  };

  useEffect(() => {
    if(props.value !== undefined) {
      setInternalValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if(props.readOnly)return;
    if(hasFocus) {
      inputElem.current?.focus();
    }
  }, [hasFocus, props.readOnly]);

  useEffect(() => {
    if(props.attributes?.autoFocus) {
      setTimeout(() => {
        inputElem.current?.focus();
        setHasFocus(true);
      }, 0);
    }
  }, [props.attributes?.autoFocus]);

  useEffect(() => {
    if(props.ref && inputElem.current) {
      props.ref.current = inputElem.current;
    }
  }, [props.ref]);

  const handleTabFocus = () => {
    if(props.readOnly)return;
    setHasFocus(true);
  };

  const handleClear = () => {
    setInternalValue('');
    props.onChange && props.onChange('');
  };
  return (
    <div className={`
      ${styles.inputContainer}
      ${hasFocus ? styles.focus : ''} 
      ${currentValue || hasFocus || props.placeholder ? styles.showOutlineNotch : ''}
      ${props.errored ? styles.errored : ''}
      ${props.style === 'outline' ? styles.outline : ''}
      ${props.disabled ? styles.disabled : ''}
      ${props.readOnly ? styles.readOnly : ''}
      ${props.className ?? ''}
    `} style={props.extraStyle}>
      <div className={styles.inputWrapper} onFocus={handleTabFocus} onClick={handleTabFocus} tabIndex={props.readOnly ? -1 : 0}>
        {props.label &&<label className={`${styles.label} ${!currentValue && !hasFocus && !props.placeholder ? styles.hide : styles.hasValue}`} htmlFor={props.name}>
          {props.label}
        </label>}
    
        <input
          className={`${styles.input} ${!currentValue && !hasFocus && !props.placeholder ? styles.hide : ''} ${props.label ? styles.hasLabel : ''}`}
          placeholder={props.placeholder}
          value={props.value ?? currentValue}          
          disabled={props.disabled || props.readOnly}
          type={props.type}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          ref={inputElem}
          onKeyUp={props.onKeyUp}
          onKeyDown={props.onKeyDown}
          tabIndex={props.readOnly ? -1 : 0}
          name={props.name}
          step={props.step}
          min={props.min}
          max={props.max}
          {...props.attributes}
        />
      </div>
      {hasFocus && currentValue && (
        <div className={styles.clearIcon} onClick={handleClear} tabIndex={-1} role="button" aria-label="Clear input">
          <FontAwesomeIcon icon={faCircleXmark} className={styles.clearInputIcon}/>
        </div>
      )}
      {style === 'outline' && <fieldset><legend>{props.label}</legend></fieldset>}
    </div>
  );
}