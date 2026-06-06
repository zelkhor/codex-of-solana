import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { useKeydown } from '@/shared/hooks/useKeydown.ts';

import { FilterPanel } from './FilterPanel.tsx';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

export const FilterDrawer = ({ isOpen, onClose, triggerRef }: FilterDrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useKeydown('Escape', onClose, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    drawerRef.current?.querySelector<HTMLInputElement>('input')?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (drawerRef.current?.contains(target)) return;
      if (triggerRef?.current?.contains(target)) return;
      if ((target as Element).closest?.('header')) return;
      // A dropdown inside the drawer is open — this click closes it; keep drawer open.
      if (drawerRef.current?.querySelector('[role="listbox"]')) return;
      onClose();
    };
    document.addEventListener('mousedown', handler, { capture: true });
    return () => document.removeEventListener('mousedown', handler, { capture: true });
  }, [isOpen, onClose, triggerRef]);

  return (
    <div
      ref={drawerRef}
      className={`absolute top-0 left-0 h-full w-full sm:w-96 z-50 bg-white dark:bg-[#2a2028] shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <FilterPanel onClose={onClose} />
    </div>
  );
};
