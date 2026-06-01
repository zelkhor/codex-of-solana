import { useEffect } from 'react';
import { X } from 'lucide-react';
import { FilterPanel } from '@/components/filters/FilterPanel';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterDrawer = ({ isOpen, onClose }: FilterDrawerProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 z-50 bg-white dark:bg-[#2a2028] shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        aria-label="Close filters"
      >
        <X size={18} />
      </button>
      <FilterPanel />
    </div>
  );
};
