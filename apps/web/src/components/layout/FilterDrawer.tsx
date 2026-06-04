import { useEffect, useRef } from 'react';
import { useKeydown } from '@/hooks/useKeydown';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { RefObject } from 'react';
import { FilterPanel } from '@/components/filters/FilterPanel';

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

  useClickOutside([drawerRef, triggerRef], onClose, isOpen);

  return (
    <div
      ref={drawerRef}
      className={`fixed top-0 left-0 h-full w-full sm:w-96 z-50 bg-white dark:bg-[#2a2028] shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <FilterPanel onClose={onClose} />
    </div>
  );
};
