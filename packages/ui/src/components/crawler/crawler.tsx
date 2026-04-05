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
import styles from './crawler.module.css';

export interface CrawlerProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  /** Scroll speed in pixels per second along the scroll axis. */
  speed?: number;
  /** When true, scrolls in the opposite direction. */
  reverse?: boolean;
  /** Gap between items (CSS length). */
  gap?: string;
  /** Pause auto-scroll while the pointer is over the viewport. */
  pauseOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Max height for vertical orientation (horizontal uses full width of parent). */
  maxHeight?: string | number;
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
    className,
    style,
    maxHeight,
  } = props;

  const trackRef = useRef<HTMLDivElement>(null);
  const setARef = useRef<HTMLDivElement>(null);
  const setBRef = useRef<HTMLDivElement>(null);
  const [setSize, setSetSize] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const offsetRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const arrayChildren = Children.toArray(children);

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
    measure();
  }, [measure, arrayChildren.length, orientation, gap]);

  useEffect(() => {
    const track = trackRef.current;
    if(!track || typeof ResizeObserver === 'undefined') {
      return;
    }
    const ro = new ResizeObserver(() => measure());
    ro.observe(track);
    return () => ro.disconnect();
  }, [measure]);

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
    if(setSize <= 0) {
      return;
    }

    const tick = (t: number) => {
      if(lastTimeRef.current === null) lastTimeRef.current = t;
      const dt = Math.min((t - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = t;

      if(!paused && speed > 0) {
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
  }, [applyTransform, paused, reverse, setSize, speed]);

  useEffect(() => {
    offsetRef.current = 0;
    applyTransform(0);
  }, [setSize, applyTransform]);

  const orientClass = orientation === 'horizontal' ? styles.horizontal : styles.vertical;
  const viewportStyle: React.CSSProperties = {
    ...style,
    ...(orientation === 'vertical' && maxHeight != null ?
      { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } :
      {}),
  };

  return (
    <div
      className={[styles.viewport, orientation === 'vertical' ? styles.vertical : '', className]
        .filter(Boolean)
        .join(' ')}
      style={viewportStyle}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      role="region"
      aria-label="Scrolling content"
    >
      <div ref={trackRef} className={`${styles.track} ${orientClass}`} style={{ gap }}>
        <div
          ref={setARef}
          className={`${styles.set} ${orientClass}`}
          style={{ gap }}
        >
          {arrayChildren.map((child, i) => wrapChild(child, i, 'a', orientation))}
        </div>
        <div
          ref={setBRef}
          className={`${styles.set} ${orientClass}`}
          style={{ gap }}
          aria-hidden
        >
          {arrayChildren.map((child, i) => wrapChild(child, i, 'b', orientation))}
        </div>
      </div>
    </div>
  );
}