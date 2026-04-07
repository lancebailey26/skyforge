'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { flagNotFoundRedirect } from '@/lib/notFoundRedirect';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    flagNotFoundRedirect();
    router.replace('/');
  }, [router]);

  return (
    <p
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      Page not found. Taking you home.
    </p>
  );
}