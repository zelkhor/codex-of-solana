import { useEffect, useRef } from 'react';

export const useDebounced = (callback: () => void, delay: number, deps: unknown[]) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const timer = setTimeout(() => callbackRef.current(), delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
};
