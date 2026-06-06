import { useEffect, useRef } from 'react';

export const useKeydown = (
  key: string,
  callback: (e: KeyboardEvent) => void,
  enabled = true,
  capture = false,
) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== key) return;
      if (capture) e.stopImmediatePropagation();
      callbackRef.current(e);
    };
    document.addEventListener('keydown', handler, capture);
    return () => document.removeEventListener('keydown', handler, capture);
  }, [key, enabled, capture]);
};
