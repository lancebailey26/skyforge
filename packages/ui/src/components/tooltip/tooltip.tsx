'use client';
import React, { useEffect, useRef, useState, ReactNode, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import styles from './tooltip.module.css';

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface TooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  placement?: Placement;
  showDelay?: number;
  hideDelay?: number;
  disabled?: boolean;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'tertiary' | 'default';
  showOnFocus?: boolean;
  className?: string;
  style?: React.CSSProperties;
  container?: HTMLElement | null;
  offset?: number;
  /** Sets the DOM `id` on the trigger wrapper (string children) or merges onto the child element. */
  id?: string;
}

export function Tooltip(props: TooltipProps) {
  const {
    children,
    content,
    placement = 'top',
    showDelay = 200,
    hideDelay = 0,
    disabled = false,
    visible: controlledVisible,
    defaultVisible = false,
    onVisibleChange,
    size = 'medium',
    color = 'default',
    showOnFocus = true,
    className,
    style,
    container,
    offset = 8,
    id: triggerDomId,
  } = props;

  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState<Placement>(placement);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipReactId = useId();
  const tooltipDomId = `skyforge-tooltip-${tooltipReactId.replace(/:/g, '')}`;

  const isControlled = controlledVisible !== undefined;
  const visible = isControlled ? controlledVisible : isVisible;

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const calculatePosition = useCallback(() => {
    if(!triggerRef.current || !tooltipRef.current)return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;
    let newPlacement: Placement = placement;

    const arrowSize = 6;
    const spacing = offset + arrowSize;

    // Calculate base position based on placement
    switch(placement) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - spacing;
        left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + spacing;
        left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case 'left':
        top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - spacing;
        break;
      case 'right':
        top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + scrollX + spacing;
        break;
      case 'top-left':
        top = triggerRect.top + scrollY - tooltipRect.height - spacing;
        left = triggerRect.left + scrollX;
        break;
      case 'top-right':
        top = triggerRect.top + scrollY - tooltipRect.height - spacing;
        left = triggerRect.right + scrollX - tooltipRect.width;
        break;
      case 'bottom-left':
        top = triggerRect.bottom + scrollY + spacing;
        left = triggerRect.left + scrollX;
        break;
      case 'bottom-right':
        top = triggerRect.bottom + scrollY + spacing;
        left = triggerRect.right + scrollX - tooltipRect.width;
        break;
    }

    // Adjust if tooltip goes outside viewport
    const padding = 8;
    if(left < padding) {
      left = padding;
      if(placement.startsWith('left') || placement === 'left') {
        newPlacement = placement.replace('left', 'right') as Placement;
      }
    }
    if(left + tooltipRect.width > viewportWidth - padding) {
      left = viewportWidth - tooltipRect.width - padding;
      if(placement.startsWith('right') || placement === 'right') {
        newPlacement = placement.replace('right', 'left') as Placement;
      }
    }
    if(top < padding) {
      top = padding;
      if(placement.startsWith('top')) {
        newPlacement = placement.replace('top', 'bottom') as Placement;
      }
    }
    if(top + tooltipRect.height > viewportHeight - padding) {
      top = viewportHeight - tooltipRect.height - padding;
      if(placement.startsWith('bottom')) {
        newPlacement = placement.replace('bottom', 'top') as Placement;
      }
    }

    setPosition({ top, left });
    setActualPlacement(newPlacement);
  }, [placement, offset]);

  const showTooltip = useCallback(() => {
    if(disabled)return;

    if(hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if(showDelay > 0) {
      showTimeoutRef.current = setTimeout(() => {
        if(!isControlled) {
          setIsVisible(true);
        }
        onVisibleChange?.(true);
        setTimeout(() => calculatePosition(), 10);
      }, showDelay);
    } else {
      if(!isControlled) {
        setIsVisible(true);
      }
      onVisibleChange?.(true);
      setTimeout(() => calculatePosition(), 10);
    }
  }, [disabled, showDelay, isControlled, onVisibleChange, calculatePosition]);

  const hideTooltip = useCallback(() => {
    if(showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    if(hideDelay > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        if(!isControlled) {
          setIsVisible(false);
        }
        onVisibleChange?.(false);
      }, hideDelay);
    } else {
      if(!isControlled) {
        setIsVisible(false);
      }
      onVisibleChange?.(false);
    }
  }, [hideDelay, isControlled, onVisibleChange]);

  useEffect(() => {
    if(visible) {
      calculatePosition();
      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [visible, calculatePosition]);

  useEffect(() => {
    return () => {
      if(showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if(hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if(!visible || disabled)return;
    const onKeyDown = (e: KeyboardEvent) => {
      if(e.key === 'Escape') {
        e.stopPropagation();
        hideTooltip();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible, disabled, hideTooltip]);

  const handleMouseEnter = () => showTooltip();
  const handleMouseLeave = () => hideTooltip();
  const handleFocus = () => {
    if(showOnFocus) showTooltip();
  };
  const handleBlur = () => hideTooltip();

  const mergeDescribedBy = (existing: unknown) => {
    const prev = typeof existing === 'string' && existing.trim() ? existing.trim() : undefined;
    if(!visible || disabled) {
      return prev;
    }
    return prev ? `${prev} ${tooltipDomId}` : tooltipDomId;
  };

  // Wrap children to add event handlers and ref
  const isReactElement = React.isValidElement(children);
  let triggerElement: React.ReactElement;

  if(isReactElement) {
    const childElement = children as React.ReactElement;
    const childProps = childElement.props as Record<string, unknown>;
    const originalRef = (childElement as { ref?: React.Ref<HTMLElement> }).ref;

    triggerElement = React.cloneElement(childElement, {
      ...childProps,
      id: (triggerDomId ?? childProps.id) as string | undefined,
      'aria-describedby': mergeDescribedBy(childProps['aria-describedby']),
      ref: (node: HTMLElement | null) => {
        if(node) {
          triggerRef.current = node;
        }
        if(typeof originalRef === 'function') {
          originalRef(node);
        } else if(originalRef && typeof originalRef === 'object' && 'current' in originalRef) {
          (originalRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      onMouseEnter: (e: React.MouseEvent) => {
        handleMouseEnter();
        if(childProps.onMouseEnter) {
          (childProps.onMouseEnter as (e: React.MouseEvent) => void)(e);
        }
      },
      onMouseLeave: (e: React.MouseEvent) => {
        handleMouseLeave();
        if(childProps.onMouseLeave) {
          (childProps.onMouseLeave as (e: React.MouseEvent) => void)(e);
        }
      },
      onFocus: (e: React.FocusEvent) => {
        handleFocus();
        if(childProps.onFocus) {
          (childProps.onFocus as (e: React.FocusEvent) => void)(e);
        }
      },
      onBlur: (e: React.FocusEvent) => {
        handleBlur();
        if(childProps.onBlur) {
          (childProps.onBlur as (e: React.FocusEvent) => void)(e);
        }
      },
    } as Partial<unknown>);
  } else {
    triggerElement = (
      <span
        id={triggerDomId}
        ref={(node) => {
          if(node) triggerRef.current = node;
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        aria-describedby={mergeDescribedBy(undefined)}
      >
        {children}
      </span>
    );
  }

  if(!isMounted || typeof document === 'undefined' || !document.body) {
    return <>{children}</>;
  }

  const tooltipContent = visible ?
(
    <div
      id={tooltipDomId}
      ref={tooltipRef}
      className={`
        ${styles.tooltip}
        ${styles[size]}
        ${styles[color]}
        ${styles[actualPlacement]}
        ${className ?? ''}
      `}
      style={{
        ...style,
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role="tooltip"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.content}>
        {typeof content === 'string' ? <span>{content}</span> : content}
      </div>
      <div className={`${styles.arrow} ${styles[`arrow-${actualPlacement}`]}`} />
    </div>
  ) :
null;

  const portalContainer = container ?? (typeof document !== 'undefined' ? document.body : null);

  return (
    <>
      {triggerElement}
      {portalContainer && tooltipContent && createPortal(tooltipContent, portalContainer)}
    </>
  );
}