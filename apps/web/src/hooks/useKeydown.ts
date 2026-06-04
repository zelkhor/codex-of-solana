import { useEffect } from 'react';

export const useKeydown = (key: string, callback: () => void, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) callback();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, callback, enabled]);
};
