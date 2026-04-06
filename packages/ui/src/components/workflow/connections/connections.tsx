'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './connections.module.css';

export interface Connection {
  from: string;
  to: string;
  fromSide?: 'left' | 'right';
  toSide?: 'left' | 'right';
  enabled?: boolean;
}

interface ConnectionsProps {
  connections: Connection[];
  nodeElements: Map<string, HTMLElement>;
  enabledStates: Map<string, boolean>;
  containerElement: HTMLElement | null;
}

interface ConnectionPath {
  id: string;
  path: string;
  enabled: boolean;
}

function getConnectionPoint(
  element: HTMLElement,
  container: HTMLElement,
  side?: 'left' | 'right',
  variant?: 'input' | 'output'
): { x: number; y: number } | null {
  if(!element || !container)return null;

  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  // Calculate position relative to container
  const relativeX = elementRect.left - containerRect.left;
  const relativeY = elementRect.top - containerRect.top;
  const centerY = relativeY + elementRect.height / 2;
  
  let x: number;

  if(side !== undefined) {
    // Processing node or junction - use specified side
    x = side === 'left' ?
      relativeX :
      relativeX + elementRect.width;
  } else if(variant !== undefined) {
    // Workflow node - use variant to determine side
    x = variant === 'input' ?
      relativeX + elementRect.width :
      relativeX;
  } else {
    // Default to right side
    x = relativeX + elementRect.width;
  }

  return { x, y: centerY };
}

function createBezierPath(start: { x: number; y: number }, end: { x: number; y: number }): string {
  const dx = end.x - start.x;
  const curvature = 0.3;
  const controlX1 = start.x + dx * curvature;
  const controlY1 = start.y;
  const controlX2 = start.x + dx * (1 - curvature);
  const controlY2 = end.y;
  
  return `M ${start.x} ${start.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${end.x} ${end.y}`;
}

export function WorkflowConnections({ 
  connections, 
  nodeElements, 
  enabledStates, 
  containerElement 
}: ConnectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<ConnectionPath[]>([]);
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });
  const rafRef = useRef<number | null>(null);

  const updatePaths = useCallback(() => {
    if(!containerRef.current || !svgRef.current || !containerElement)return;

    // Update SVG dimensions to match container
    const containerRect = containerElement.getBoundingClientRect();
    const width = containerRect.width || 1;
    const height = containerRect.height || 1;
    setDimensions({ width, height });

    const newPaths: ConnectionPath[] = [];

    connections.forEach((conn, index) => {
      const fromElement = nodeElements.get(conn.from);
      const toElement = nodeElements.get(conn.to);

      if(!fromElement || !toElement)return;

      // Determine node types and variants
      const fromVariant = fromElement.getAttribute('data-node-variant') as 'input' | 'output' | null;
      const fromType = fromElement.getAttribute('data-node-type');
      const toVariant = toElement.getAttribute('data-node-variant') as 'input' | 'output' | null;
      const toType = toElement.getAttribute('data-node-type');

      const fromSide = (fromType === 'processing-node' || fromType === 'junction') ? 
        (conn.fromSide || 'right') :
        undefined;
      const toSide = (toType === 'processing-node' || toType === 'junction') ?
        (conn.toSide || 'left') :
        undefined;

      const startPoint = getConnectionPoint(fromElement, containerElement, fromSide, fromVariant || undefined);
      const endPoint = getConnectionPoint(toElement, containerElement, toSide, toVariant || undefined);

      if(startPoint && endPoint) {
        const path = createBezierPath(startPoint, endPoint);
        const isEnabled = conn.enabled !== false && 
          (enabledStates.get(conn.from) !== false) && 
          (enabledStates.get(conn.to) !== false);
        
        newPaths.push({
          id: `${conn.from}-${conn.to}-${index}`,
          path,
          enabled: isEnabled
        });
      }
    });

    setPaths(newPaths);
  }, [connections, nodeElements, enabledStates, containerElement]);

  useEffect(() => {
    if(!containerElement)return;

    // Cancel any pending animation frame
    if(rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    const scheduleUpdate = () => {
      rafRef.current = requestAnimationFrame(() => {
        updatePaths();
        rafRef.current = null;
      });
    };

    // Initial update with a small delay to ensure DOM is ready
    const initialTimeout = setTimeout(() => {
      scheduleUpdate();
    }, 50);

    // Use ResizeObserver to track container and node size changes
    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });

    resizeObserver.observe(containerElement);

    // Observe all node elements
    nodeElements.forEach((element) => {
      if(element) {
        resizeObserver.observe(element);
      }
    });

    // Update on window resize
    const handleResize = () => {
      scheduleUpdate();
    };

    window.addEventListener('resize', handleResize);

    // Update on scroll (in case container scrolls)
    const handleScroll = () => {
      scheduleUpdate();
    };

    containerElement.addEventListener('scroll', handleScroll, true);

    // Also observe mutations to catch when nodes are added/removed
    const mutationObserver = new MutationObserver(() => {
      scheduleUpdate();
    });

    mutationObserver.observe(containerElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      clearTimeout(initialTimeout);
      if(rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      containerElement.removeEventListener('scroll', handleScroll, true);
    };
  }, [containerElement, nodeElements, updatePaths]);

  // Also update when connections or enabled states change
  useEffect(() => {
    if(containerElement) {
      const timeout = setTimeout(() => {
        updatePaths();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [connections, enabledStates, containerElement, updatePaths]);

  return (
    <div ref={containerRef} className={styles.container}>
      <svg
        ref={svgRef}
        className={styles.svg}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {paths.map(({ id, path, enabled }) => (
          <path
            key={id}
            d={path}
            fill="none"
            stroke={enabled ? 'var(--color-primary)' : 'var(--color-border)'}
            strokeWidth={enabled ? 2 : 1}
            strokeDasharray={enabled ? 'none' : '4 2'}
            opacity={enabled ? 0.8 : 0.4}
            className={styles.path}
          />
        ))}
      </svg>
    </div>
  );
}