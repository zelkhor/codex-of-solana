import { useEffect, useRef, useState } from 'react';

import { Check, ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const Select = ({ options, value, onChange, disabled, className = '' }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((v) => !v)}
        className="cursor-pointer flex items-center gap-2 text-sm bg-zinc-100 dark:bg-zinc-700 rounded-lg pl-3 pr-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        <span className="flex-1 text-left">{selected?.label ?? value}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 text-zinc-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full right-0 mt-1 z-50 min-w-full rounded-lg bg-white dark:bg-zinc-800 shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`cursor-pointer w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${
                opt.value === value
                  ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Check
                size={12}
                className={`shrink-0 transition-opacity ${opt.value === value ? 'opacity-100' : 'opacity-0'}`}
              />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
