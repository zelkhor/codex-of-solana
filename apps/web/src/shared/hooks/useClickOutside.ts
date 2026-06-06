import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

type MaybeRef = RefObject<Element | null> | undefined | null;

export const useClickOutside = (refs: MaybeRef[], callback: () => void, enabled = true) => {
  const refsRef = useRef(refs);
  refsRef.current = refs;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInside = refsRef.current.some((ref) => ref?.current?.contains(target));
      if (!isInside) callbackRef.current();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [enabled]);
};
