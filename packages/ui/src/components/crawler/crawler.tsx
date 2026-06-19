'use client';

import type React from 'react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Children,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './crawler.module.css';

const DRAG_THRESHOLD_SQ = 8 * 8;
const BUTTON_SCROLL_MS_PER_PX = 0.9;
const BUTTON_SCROLL_DURATION_MIN = 320;
const BUTTON_SCROLL_DURATION_MAX = 480;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function normalizeOffset(offset: number, size: number) {
  let next = offset;
  while(next >= size) next -= size;
  while(next < 0) next += size;
  return next;
}

function swallowNextClickCapture() {
  const swallow = (ev: Event) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    document.removeEventListener('click', swallow, true);
  };
  document.addEventListener('click', swallow, true);
  window.setTimeout(() => document.removeEventListener('click', swallow, true), 100);
}

export interface CrawlerProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  /** Scroll speed (px/s) along the scroll axis. */
  speed?: number;
  /** When true, invert scroll direction. */
  reverse?: boolean;
  /** Gap between items (CSS length). */
  gap?: string;
  /** Pause auto-scroll while the pointer is over the viewport. */
  pauseOnHover?: boolean;
  /** Drag scrubs the strip; taps still work on buttons, links, inputs, etc. */
  draggable?: boolean;
  /** Static strip: no auto-scroll, no duplicated children for looping. */
  noScroll?: boolean;
  /** When `noScroll` is set, anchor the strip (horizontal: start = left, end = right). */
  noScrollAlign?: 'start' | 'end' | 'center';
  className?: string;
  style?: React.CSSProperties;
  /** Max height for vertical orientation (horizontal uses full width of parent). */
  maxHeight?: string | number;
  /** Prev/next controls for manual scrubbing (horizontal scrolling crawlers). */
  scrollButtons?: boolean;
  /** Optional stacked list; pair with `layout` to switch away from the scrolling strip. */
  list?: React.ReactNode;
  /** With `list`: `auto` switches at 80rem; `list` / `scroll` force one mode. */
  layout?: 'auto' | 'list' | 'scroll';
  id?: string;
}

function isNativeControlTarget(target: EventTarget | null): boolean {
  if(!target || !(target instanceof Element)) {
    return false;
  }
  return Boolean(target.closest('button, a, input, textarea, select, [data-crawler-no-drag]'));
}

function wrapChild(child: React.ReactNode, index: number, suffix: string, orient: 'horizontal' | 'vertical') {
  return (
    <div key={`${suffix}-${index}`} className={`${styles.item} ${styles[orient]}`}>
      {child}
    </div>
  );
}

export function Crawler(props: CrawlerProps) {
  const {
    children,
    orientation = 'horizontal',
    speed: speedProp = 48,
    reverse = false,
    gap = '1rem',
    pauseOnHover = true,
    draggable = true,
    noScroll = false,
    noScrollAlign = 'center',
    className,
    style,
    maxHeight,
    scrollButtons = true,
    list,
    layout = 'auto',
    id,
  } = props;

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setARef = useRef<HTMLDivElement>(null);
  const setBRef = useRef<HTMLDivElement>(null);
  const [setSize, setSetSize] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const offsetRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const isPointerDraggingRef = useRef(false);
  const dragLastRef = useRef<{ x: number; y: number } | null>(null);
  const pendingDragRef = useRef<{ pointerId: number; startX: number; startY: number } | null>(null);
  const activeDragPointerIdRef = useRef<number | null>(null);
  const windowDragCleanupRef = useRef<(() => void) | null>(null);
  const dragCommittedRef = useRef(false);
  const buttonAnimRef = useRef<{
    start: number;
    target: number;
    startTime: number;
    duration: number;
  } | null>(null);

  const arrayChildren = Children.toArray(children);
  const isScrolling = !noScroll;

  const detachWindowDragProbe = useCallback(() => {
    if(windowDragCleanupRef.current) {
      windowDragCleanupRef.current();
      windowDragCleanupRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => detachWindowDragProbe();
  }, [detachWindowDragProbe]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const speed = reduceMotion ? 0 : speedProp;

  const measure = useCallback(() => {
    const a = setARef.current;
    const b = setBRef.current;
    if(!a || !b) {
      return;
    }
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const size = orientation === 'horizontal' ? br.left - ar.left : br.top - ar.top;
    if(size > 0) {
      setSetSize(size);
    }
  }, [orientation]);

  useLayoutEffect(() => {
    if(!isScrolling) {
      return;
    }
    measure();
  }, [isScrolling, measure, arrayChildren.length, orientation, gap]);

  useEffect(() => {
    if(!isScrolling) {
      return;
    }
    const track = trackRef.current;
    if(!track || typeof ResizeObserver === 'undefined') {
      return;
    }
    const ro = new ResizeObserver(() => measure());
    ro.observe(track);
    return () => ro.disconnect();
  }, [isScrolling, measure]);

  const applyTransform = useCallback(
    (offset: number) => {
      const track = trackRef.current;
      if(!track) {
        return;
      }
      if(orientation === 'horizontal') {
        track.style.transform = `translate3d(${-offset}px,0,0)`;
      } else {
        track.style.transform = `translate3d(0,${-offset}px,0)`;
      }
    },
    [orientation]
  );

  useEffect(() => {
    if(!isScrolling || setSize <= 0) {
      return;
    }

    const tick = (t: number) => {
      if(lastTimeRef.current === null) lastTimeRef.current = t;
      const dt = Math.min((t - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = t;

      const anim = buttonAnimRef.current;
      if(anim) {
        const elapsed = t - anim.startTime;
        const progress = Math.min(elapsed / anim.duration, 1);
        const eased = easeOutCubic(progress);
        offsetRef.current = anim.start + (anim.target - anim.start) * eased;
        applyTransform(offsetRef.current);
        if(progress >= 1) {
          offsetRef.current = normalizeOffset(anim.target, setSize);
          applyTransform(offsetRef.current);
          buttonAnimRef.current = null;
        }
      } else if(!paused && !isPointerDraggingRef.current && speed > 0) {
        const dir = reverse ? -1 : 1;
        offsetRef.current += speed * dt * dir;
        while(offsetRef.current >= setSize) offsetRef.current -= setSize;
        while(offsetRef.current < 0) offsetRef.current += setSize;
        applyTransform(offsetRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
  }, [applyTransform, isScrolling, paused, reverse, setSize, speed]);

  useEffect(() => {
    if(!isScrolling) {
      return;
    }
    buttonAnimRef.current = null;
    offsetRef.current = 0;
    applyTransform(0);
  }, [isScrolling, setSize, applyTransform]);

  const applyDragDelta = useCallback(
    (clientX: number, clientY: number) => {
      if(dragLastRef.current === null) {
        return;
      }
      const { x: lx, y: ly } = dragLastRef.current;
      dragLastRef.current = { x: clientX, y: clientY };
      const dx = clientX - lx;
      const dy = clientY - ly;
      if(orientation === 'horizontal') {
        offsetRef.current -= dx;
      } else {
        offsetRef.current -= dy;
      }
      const sz = setSize;
      while(offsetRef.current >= sz) offsetRef.current -= sz;
      while(offsetRef.current < 0) offsetRef.current += sz;
      applyTransform(offsetRef.current);
    },
    [orientation, setSize, applyTransform]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if(!draggable || setSize <= 0) {
        return;
      }
      if(e.pointerType === 'mouse' && e.button !== 0) {
        return;
      }
      if(isNativeControlTarget(e.target)) {
        return;
      }

      detachWindowDragProbe();
      dragCommittedRef.current = false;
      pendingDragRef.current = { pointerId: e.pointerId, startX: e.clientX, startY: e.clientY };

      const onWindowMove = (ev: PointerEvent) => {
        if(pendingDragRef.current === null) {
          return;
        }
        if(ev.pointerId !== pendingDragRef.current.pointerId) {
          return;
        }
        const { startX, startY } = pendingDragRef.current;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if(dx * dx + dy * dy < DRAG_THRESHOLD_SQ) {
          return;
        }

        const vp = viewportRef.current;
        if(!vp) {
          return;
        }

        pendingDragRef.current = null;
        detachWindowDragProbe();

        try {
          vp.setPointerCapture(ev.pointerId);
        } catch{
          return;
        }

        dragCommittedRef.current = true;
        activeDragPointerIdRef.current = ev.pointerId;
        isPointerDraggingRef.current = true;
        buttonAnimRef.current = null;
        dragLastRef.current = { x: ev.clientX, y: ev.clientY };
        setIsGrabbing(true);
      };

      const onWindowUpOrCancel = (ev: PointerEvent) => {
        if(pendingDragRef.current !== null && ev.pointerId === pendingDragRef.current.pointerId) {
          pendingDragRef.current = null;
        }
        detachWindowDragProbe();
      };

      window.addEventListener('pointermove', onWindowMove);
      window.addEventListener('pointerup', onWindowUpOrCancel);
      window.addEventListener('pointercancel', onWindowUpOrCancel);
      windowDragCleanupRef.current = () => {
        window.removeEventListener('pointermove', onWindowMove);
        window.removeEventListener('pointerup', onWindowUpOrCancel);
        window.removeEventListener('pointercancel', onWindowUpOrCancel);
      };
    },
    [draggable, setSize, detachWindowDragProbe]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if(!isPointerDraggingRef.current) {
        return;
      }
      if(activeDragPointerIdRef.current !== null && e.pointerId !== activeDragPointerIdRef.current) {
        return;
      }
      applyDragDelta(e.clientX, e.clientY);
    },
    [applyDragDelta]
  );

  const endPointerDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      detachWindowDragProbe();
      if(!isPointerDraggingRef.current) {
        return;
      }
      if(activeDragPointerIdRef.current !== null && e.pointerId !== activeDragPointerIdRef.current) {
        return;
      }
      const hadCommittedDrag = dragCommittedRef.current;
      dragCommittedRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch{
        /* already released */
      }
      isPointerDraggingRef.current = false;
      dragLastRef.current = null;
      activeDragPointerIdRef.current = null;
      setIsGrabbing(false);
      if(hadCommittedDrag) {
        swallowNextClickCapture();
      }
    },
    [detachWindowDragProbe]
  );

  const onLostPointerCapture = useCallback(() => {
    detachWindowDragProbe();
    const hadCommittedDrag = dragCommittedRef.current;
    dragCommittedRef.current = false;
    pendingDragRef.current = null;
    isPointerDraggingRef.current = false;
    dragLastRef.current = null;
    activeDragPointerIdRef.current = null;
    setIsGrabbing(false);
    if(hadCommittedDrag) {
      swallowNextClickCapture();
    }
  }, [detachWindowDragProbe]);

  const getItemStep = useCallback(() => {
    const setA = setARef.current;
    if(setA && setA.children.length >= 2) {
      const first = setA.children[0].getBoundingClientRect();
      const second = setA.children[1].getBoundingClientRect();
      return second.left - first.left;
    }
    if(setA && setA.children.length === 1) {
      return setA.children[0].getBoundingClientRect().width;
    }
    const viewport = viewportRef.current;
    return viewport ? Math.max(viewport.clientWidth * 0.72, 180) : 180;
  }, []);

  const startButtonScroll = useCallback(
    (visualDirection: 'left' | 'right') => {
      if(setSize <= 0 || buttonAnimRef.current) {
        return;
      }

      const step = getItemStep();
      if(step <= 0) {
        return;
      }

      const start = offsetRef.current;
      const target = start + (visualDirection === 'left' ? step : -step);

      if(reduceMotion) {
        offsetRef.current = normalizeOffset(target, setSize);
        applyTransform(offsetRef.current);
        return;
      }

      buttonAnimRef.current = {
        start,
        target,
        startTime: performance.now(),
        duration: Math.min(
          Math.max(step * BUTTON_SCROLL_MS_PER_PX, BUTTON_SCROLL_DURATION_MIN),
          BUTTON_SCROLL_DURATION_MAX,
        ),
      };
    },
    [applyTransform, getItemStep, reduceMotion, setSize],
  );

  const onScrollBack = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      startButtonScroll('left');
    },
    [startButtonScroll],
  );

  const onScrollForward = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      startButtonScroll('right');
    },
    [startButtonScroll],
  );

  const orientClass = orientation === 'horizontal' ? styles.horizontal : styles.vertical;
  const horizontalReverse = orientation === 'horizontal' && reverse;
  const canDrag = isScrolling && draggable && setSize > 0 && arrayChildren.length > 0;
  const showScrollButtons =
    scrollButtons &&
    orientation === 'horizontal' &&
    isScrolling &&
    arrayChildren.length > 1 &&
    setSize > 0;
  const noScrollAlignClass =
    noScroll && noScrollAlign === 'start' ? styles.noScrollAlignStart :
      noScroll && noScrollAlign === 'end' ? styles.noScrollAlignEnd :
        noScroll && noScrollAlign === 'center' ? styles.noScrollAlignCenter :
          '';

  const viewportStyle: React.CSSProperties = {
    ...style,
    ...(orientation === 'vertical' && maxHeight != null ?
      { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } :
      {}),
  };

  const scrollStrip = (
    <div
      className={[
        styles.shell,
        showScrollButtons ? styles.shellWithScrollButtons : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showScrollButtons ?
        (
          <>
            <button
              type="button"
              className={`${styles.scrollBtn} ${styles.scrollBtnPrev}`}
              onClick={onScrollBack}
              aria-label="Scroll back"
              data-crawler-no-drag
            >
              <FontAwesomeIcon icon={faChevronLeft} aria-hidden />
            </button>
            <button
              type="button"
              className={`${styles.scrollBtn} ${styles.scrollBtnNext}`}
              onClick={onScrollForward}
              aria-label="Scroll forward"
              data-crawler-no-drag
            >
              <FontAwesomeIcon icon={faChevronRight} aria-hidden />
            </button>
          </>
        ) :
        null}
      <div
        id={list == null ? id : undefined}
        ref={viewportRef}
        className={[
          styles.viewport,
          orientation === 'vertical' ? styles.vertical : '',
          horizontalReverse ? styles.horizontalReverse : '',
          canDrag ? styles.draggable : '',
          canDrag && isGrabbing ? styles.dragging : '',
          noScroll ? styles.noScroll : '',
          noScrollAlignClass,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={viewportStyle}
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
        onLostPointerCapture={onLostPointerCapture}
        role="region"
        aria-label={noScroll ? 'Content' : 'Scrolling content'}
      >
        <div ref={trackRef} className={`${styles.track} ${orientClass}`} style={{ gap }}>
          <div
            ref={setARef}
            className={`${styles.set} ${orientClass}`}
            style={{ gap }}
          >
            {arrayChildren.map((child, i) => wrapChild(child, i, 'a', orientation))}
          </div>
          {isScrolling ? (
            <div
              ref={setBRef}
              className={`${styles.set} ${orientClass}`}
              style={{ gap }}
              aria-hidden
            >
              {arrayChildren.map((child, i) => wrapChild(child, i, 'b', orientation))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  if(list != null) {
    return (
      <div className={styles.deck} data-layout={layout} id={id}>
        <div className={styles.deckList}>{list}</div>
        <div className={styles.deckScroll}>{scrollStrip}</div>
      </div>
    );
  }

  return scrollStrip;
}