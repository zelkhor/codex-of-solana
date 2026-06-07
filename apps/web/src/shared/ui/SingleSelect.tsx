import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

import { Check, ChevronDown, Search } from 'lucide-react';

import { useClickOutside } from '@/shared/hooks/useClickOutside.ts';
import { useKeydown } from '@/shared/hooks/useKeydown.ts';

interface SingleSelectProps<T extends string> {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder: string;
  clearLabel: string;
  renderLeading?: (value: T) => ReactNode;
}

export const SingleSelect = <T extends string>({
  options,
  value,
  onChange,
  placeholder,
  clearLabel,
  renderLeading,
}: SingleSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setIsOpen(false);
    setSearch('');
  };

  useClickOutside([containerRef], close, isOpen);
  useKeydown('Escape', close, isOpen, true);

  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="cursor-pointer flex items-center gap-2 text-sm bg-zinc-100 dark:bg-zinc-700 rounded-lg pl-3 pr-2.5 py-1.5 w-full outline-none min-h-9.5"
      >
        {value ? (
          <>
            {renderLeading?.(value)}
            <span className="flex-1 text-left text-zinc-900 dark:text-zinc-100">{value}</span>
          </>
        ) : (
          <span className="flex-1 text-left text-xs text-zinc-400/80">{placeholder}</span>
        )}
        <ChevronDown
          size={13}
          className={`shrink-0 text-zinc-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg bg-white dark:bg-zinc-800 shadow-lg overflow-hidden">
          <div className="p-2 border-b border-zinc-100 dark:border-zinc-700">
            <div className="flex items-center gap-2 px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-md">
              <Search size={12} className="text-zinc-400 shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-52">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                close();
              }}
              className={`cursor-pointer w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${
                value === null
                  ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              <Check
                size={12}
                className={`shrink-0 transition-opacity ${value === null ? 'opacity-100' : 'opacity-0'}`}
              />
              {clearLabel}
            </button>
            {filtered.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  close();
                }}
                className={`cursor-pointer w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${
                  option === value
                    ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Check
                  size={12}
                  className={`shrink-0 transition-opacity ${option === value ? 'opacity-100' : 'opacity-0'}`}
                />
                {renderLeading?.(option)}
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
