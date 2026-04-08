'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
  type MouseEvent as ReactMouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './dropdown.module.css';
import { SimpleInput } from '../simple-input/simple-input';

type DropdownContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  searchable: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext(component: string): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if(!ctx) {
    throw new Error(`${component} must be used within <Dropdown>`);
  }
  return ctx;
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined | null>) {
  return (node: T | null) => {
    for(const ref of refs) {
      if(!ref) continue;
      if(typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

export type DropdownProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  /** When true, {@link DropdownContent} shows a filter field above the list; {@link DropdownItem} rows match the query. */
  searchable?: boolean;
};

function flattenText(node: ReactNode): string {
  if(node == null || typeof node === 'boolean') {
    return '';
  }
  if(typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if(Array.isArray(node)) {
    return node.map(flattenText).join('');
  }
  if(React.isValidElement(node)) {
    const p = node.props as { children?: ReactNode };
    return flattenText(p.children);
  }
  return '';
}

/**
 * Anchors a trigger (e.g. {@link SimpleInput} showing the selected value) and a floating list panel.
 * Compose with {@link DropdownTrigger} and {@link DropdownContent}; use {@link DropdownItem} for options.
 */
export function Dropdown(props: DropdownProps) {
  const {
    children,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    className,
    searchable = false,
  } = props;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [searchQuery, setSearchQuery] = useState('');
  const triggerRef = useRef<HTMLElement | null>(null);
  const reactId = useId();
  const contentId = `skyforge-dropdown-${reactId.replace(/:/g, '')}`;

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if(!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  useLayoutEffect(() => {
    if(open && searchable) {
      setSearchQuery('');
    }
  }, [open, searchable]);

  const value = useMemo<DropdownContextValue>(
    () => ({
      open,
      setOpen,
      triggerRef,
      contentId,
      searchable,
      searchQuery,
      setSearchQuery,
    }),
    [open, setOpen, contentId, searchable, searchQuery],
  );

  return (
    <DropdownContext.Provider value={value}>
      <div className={`${styles.root} ${className ?? ''}`.trim()}>{children}</div>
    </DropdownContext.Provider>
  );
}

export type DropdownTriggerProps = {
  /** Single React element (e.g. {@link SimpleInput}) that receives ref, aria attributes, and toggle handlers */
  children: ReactElement;
  className?: string;
};

export function DropdownTrigger(props: DropdownTriggerProps) {
  const { children, className } = props;
  const { open, setOpen, triggerRef, contentId } = useDropdownContext('DropdownTrigger');
  const childProps = children.props as Record<string, unknown>;
  const originalRef = (children as { ref?: Ref<HTMLElement> }).ref;
  const isSimpleInputChild = children.type === SimpleInput;

  const merged: Record<string, unknown> = {
    ...childProps,
    ref: mergeRefs<HTMLElement>(triggerRef, originalRef),
    className: [childProps.className, className].filter(Boolean).join(' ') || undefined,
    'aria-expanded': open,
    'aria-haspopup': 'listbox',
    'aria-controls': contentId,
    onClick: (e: ReactMouseEvent<HTMLElement>) => {
      (childProps.onClick as ((ev: ReactMouseEvent<HTMLElement>) => void) | undefined)?.(e);
      if(e.defaultPrevented)return;
      setOpen(!open);
    },
    onKeyDown: (e: ReactKeyboardEvent<HTMLElement>) => {
      (childProps.onKeyDown as ((ev: ReactKeyboardEvent<HTMLElement>) => void) | undefined)?.(e);
      if(e.defaultPrevented)return;
      if(e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if(e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
    },
  };

  if(isSimpleInputChild) {
    merged.readOnly = true;
    merged.pointerCursor = true;
  }

  return React.cloneElement(children, merged as Partial<unknown>);
}

function useDropdownPosition(
  open: boolean,
  triggerRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>,
) {
  const [style, setStyle] = useState<CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    width: 0,
    visibility: 'hidden',
  });

  const update = useCallback(() => {
    const el = triggerRef.current;
    const panel = contentRef.current;
    if(!el || !panel)return;

    const rect = el.getBoundingClientRect();
    const margin = 4;
    let top = rect.bottom + margin;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const panelHeight = panel.getBoundingClientRect().height || 200;

    let left = rect.left;
    const width = rect.width;

    if(left + width > vw - 8) {
      left = Math.max(8, vw - width - 8);
    }
    if(top + panelHeight > vh - 8) {
      const above = rect.top - margin - panelHeight;
      if(above >= 8) {
        top = above;
      }
    }

    setStyle({
      position: 'fixed',
      top,
      left,
      width,
      minWidth: rect.width,
      maxWidth: `min(${vw - 16}px, 100vw - 16px)`,
      visibility: 'visible',
      zIndex: 1200,
    });
  }, [triggerRef, contentRef]);

  useEffect(() => {
    if(!open)return;
    update();
    const onWin = () => update();
    window.addEventListener('resize', onWin);
    window.addEventListener('scroll', onWin, true);
    return () => {
      window.removeEventListener('resize', onWin);
      window.removeEventListener('scroll', onWin, true);
    };
  }, [open, update]);

  useEffect(() => {
    if(!open)return;
    const id = requestAnimationFrame(() => update());
    return () => cancelAnimationFrame(id);
  }, [open, update]);

  return style;
}

export type DropdownContentProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Portal mount node (default: document.body) */
  container?: HTMLElement | null;
  /** Placeholder for the filter field when {@link Dropdown} `searchable` is true */
  searchPlaceholder?: string;
  /** Accessible label for the filter field (default: "Filter options") */
  searchAriaLabel?: string;
};

export function DropdownContent(props: DropdownContentProps) {
  const {
    children,
    className,
    style: styleProp,
    container,
    searchPlaceholder = 'Search…',
    searchAriaLabel = 'Filter options',
  } = props;
  const { open, setOpen, triggerRef, contentId, searchable, searchQuery, setSearchQuery } =
    useDropdownContext('DropdownContent');
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const positionStyle = useDropdownPosition(open, triggerRef, contentRef);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if(!open)return;
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if(triggerRef.current?.contains(t))return;
      if(contentRef.current?.contains(t))return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open, setOpen, triggerRef]);

  useEffect(() => {
    if(!open)return;
    const onKey = (e: KeyboardEvent) => {
      if(e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if(!mounted || typeof document === 'undefined') {
    return null;
  }

  const portalTarget = container ?? document.body;
  if(!open) {
    return null;
  }

  const panel = (
    <div
      ref={contentRef}
      className={`${styles.content} ${className ?? ''}`.trim()}
      style={{ ...positionStyle, ...styleProp }}
    >
      {searchable ?
(
        <div className={styles.searchRow}>
          <SimpleInput
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchAriaLabel}
            className={styles.searchInputRoot}
          />
        </div>
      ) :
null}
      <div id={contentId} role="listbox" className={styles.list}>
        {children}
      </div>
    </div>
  );

  return createPortal(panel, portalTarget);
}

export type DropdownItemProps = {
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  onSelect?: () => void;
  /** When {@link Dropdown} is searchable, used to match the query (defaults to text content of `children`) */
  filterText?: string;
};

export function DropdownItem(props: DropdownItemProps) {
  const { children, selected, disabled, className, onSelect, filterText } = props;
  const { setOpen, searchable, searchQuery } = useDropdownContext('DropdownItem');

  const text = filterText ?? flattenText(children);
  const q = searchQuery.trim().toLowerCase();
  const matches =
    !searchable || !q || text.trim().toLowerCase().includes(q);
  if(!matches) {
    return null;
  }

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected ?? false}
      disabled={disabled}
      className={`${styles.item} ${className ?? ''}`.trim()}
      onClick={(e) => {
        e.preventDefault();
        if(disabled)return;
        onSelect?.();
        setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  useDropdownContext('DropdownSeparator');
  return <div className={styles.separator} role="separator" aria-hidden />;
}