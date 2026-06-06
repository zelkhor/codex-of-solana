import { useEffect, useRef } from 'react';

export const useKeydown = (key: string, callback: (e: KeyboardEvent) => void, enabled = true) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) callbackRef.current(e);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, enabled]);
};
