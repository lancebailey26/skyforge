'use client';
import { useEffect, useRef } from 'react';
import { useReactFlow, useNodes } from 'reactflow';

export function FitViewHelper() {
  const { fitView } = useReactFlow();
  const nodes = useNodes();
  const hasFitted = useRef(false);

  useEffect(() => {
    if(nodes.length > 0 && !hasFitted.current) {
      const timeout = setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 });
        hasFitted.current = true;
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [nodes.length, fitView]);

  return null;
}