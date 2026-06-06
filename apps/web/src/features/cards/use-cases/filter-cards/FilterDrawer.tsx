import { useEffect, useRef } from 'react';

import { useKeydown } from '@/shared/hooks/useKeydown.ts';

import { FilterPanel } from './FilterPanel.tsx';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterDrawer = ({ isOpen, onClose }: FilterDrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useKeydown('Escape', onClose, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    drawerRef.current?.querySelector<HTMLInputElement>('input')?.focus();
  }, [isOpen]);

  return (
    <div
      ref={drawerRef}
      className={`absolute top-0 left-0 h-full w-full sm:w-96 z-50 bg-white dark:bg-[#2a2028] shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <FilterPanel onClose={onClose} />
    </div>
  );
};
