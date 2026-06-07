import { useRef, useState } from 'react';

import { Check, ChevronDown } from 'lucide-react';

import { HEROES, type HeroT } from '@codex/core';

import { useClickOutside } from '@/shared/hooks/useClickOutside.ts';
import { useKeydown } from '@/shared/hooks/useKeydown.ts';

interface HeroFilterProps {
  value: HeroT | null;
  onChange: (hero: HeroT | null) => void;
}

const HERO_OPTIONS = Object.values(HEROES).sort((a, b) => a.localeCompare(b));

const HeroAvatar = ({ name }: { name: string }) => (
  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-300 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 text-[10px] font-semibold shrink-0">
    {name[0]}
  </span>
);

export const HeroFilter = ({ value, onChange }: HeroFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside([containerRef], () => setIsOpen(false), isOpen);
  useKeydown('Escape', () => setIsOpen(false), isOpen);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="cursor-pointer flex items-center gap-2 text-sm bg-zinc-100 dark:bg-zinc-700 rounded-lg pl-3 pr-2.5 py-1.5 w-full outline-none"
      >
        {value ? (
          <>
            <HeroAvatar name={value} />
            <span className="flex-1 text-left text-zinc-900 dark:text-zinc-100">{value}</span>
          </>
        ) : (
          <span className="flex-1 text-left text-zinc-400 dark:text-zinc-500">Any hero</span>
        )}
        <ChevronDown
          size={13}
          className={`shrink-0 text-zinc-400 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg bg-white dark:bg-zinc-800 shadow-lg overflow-y-auto max-h-64">
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setIsOpen(false);
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
            Any hero
          </button>
          {HERO_OPTIONS.map((hero) => (
            <button
              key={hero}
              type="button"
              onClick={() => {
                onChange(hero);
                setIsOpen(false);
              }}
              className={`cursor-pointer w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${
                hero === value
                  ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Check
                size={12}
                className={`shrink-0 transition-opacity ${hero === value ? 'opacity-100' : 'opacity-0'}`}
              />
              <HeroAvatar name={hero} />
              {hero}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
