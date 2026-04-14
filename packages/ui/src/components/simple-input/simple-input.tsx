'use client';
import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import styles from './simple-input.module.css';

export type SimpleInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  /** Optional text label above the field */
  label?: string;
  /** `id` on the outer wrapper (the native input uses `id` from HTML attributes for label association). */
  rootId?: string;
  /** Class on the native input */
  inputClassName?: string;
  /** Class on the outer root (width, margins, dropdown trigger ref target) */
  className?: string;
  invalid?: boolean;
  /** Use with read-only triggers (e.g. non-searchable dropdown): pointer cursor, no text-selection caret */
  pointerCursor?: boolean;
};

function mergeClassNames(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

export const SimpleInput = forwardRef<HTMLDivElement, SimpleInputProps>(
  function SimpleInput(props, ref) {
    const {
      label,
      rootId,
      id: idProp,
      className,
      inputClassName,
      invalid,
      pointerCursor,
      disabled,
      readOnly,
      onFocus,
      onBlur,
      onKeyDown,
      onClick,
      ...inputProps
    } = props;
    const autoId = useId();
    const inputId = idProp ?? `skyforge-simple-input-${autoId.replace(/:/g, '')}`;
    const [focusWithin, setFocusWithin] = useState(false);

    const handleFocus: typeof onFocus = (e) => {
      setFocusWithin(true);
      onFocus?.(e);
    };

    const handleBlur: typeof onBlur = (e) => {
      setFocusWithin(false);
      onBlur?.(e);
    };

    return (
      <div
        id={rootId}
        ref={ref}
        className={mergeClassNames(
          styles.root,
          focusWithin && styles.focusWithin,
          invalid && styles.invalid,
          disabled && styles.disabled,
          pointerCursor && styles.asPointer,
          className,
        )}
        onClick={onClick}
      >
        {label ? (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        ) : null}
        <div className={styles.field}>
          <input
            id={inputId}
            className={mergeClassNames(styles.input, inputClassName)}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={invalid || undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            {...inputProps}
          />
        </div>
      </div>
    );
  },
);
