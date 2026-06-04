import { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';

interface OptionGroup {
  label: string;
  options: readonly string[];
}

interface MultiSelectProps {
  options?: readonly string[];
  groups?: readonly OptionGroup[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const MultiSelect = ({
  options,
  groups,
  selected,
  onChange,
  placeholder = 'Search…',
}: MultiSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
    if (e.key === 'Backspace' && searchQuery === '' && selected.length > 0) {
      onChange(selected.slice(0, -1));
    }
  };

  const matches = (opt: string) =>
    !searchQuery.trim() || opt.toLowerCase().includes(searchQuery.toLowerCase());

  const renderedGroups: OptionGroup[] = groups
    ? groups
        .map((g) => ({ label: g.label, options: g.options.filter(matches) }))
        .filter((g) => g.options.length > 0)
    : [{ label: '', options: (options ?? []).filter(matches) }];

  const hasResults = renderedGroups.some((g) => g.options.length > 0);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex flex-wrap gap-1.5 items-center min-h-[38px] px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 cursor-text"
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selected.map((val) => (
          <span
            key={val}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 text-xs shrink-0"
          >
            {val}
            <button
              className="cursor-pointer opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                toggle(val);
              }}
              aria-label={`Remove ${val}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : ''}
          className="flex-1 min-w-20 text-sm bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400/80 placeholder:text-xs"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {selected.length > 0 && (
          <button
            className="cursor-pointer shrink-0 ml-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
            aria-label="Clear all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg bg-white dark:bg-zinc-800 shadow-lg max-h-80 overflow-y-auto"
          role="listbox"
          aria-multiselectable="true"
        >
          {!hasResults ? (
            <div className="px-3 py-2 text-sm text-zinc-400">No results</div>
          ) : (
            renderedGroups.map((group, i) => (
              <div key={i}>
                {groups && group.label && (
                  <div className="px-3 pt-2.5 pb-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide sticky top-0 bg-white dark:bg-zinc-900">
                    {group.label}
                  </div>
                )}
                {group.options.map((opt) => {
                  const isSelected = selected.includes(opt);
                  return (
                    <button
                      key={opt}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => toggle(opt)}
                      className={`cursor-pointer w-full text-left px-3 py-1.5 text-sm flex items-center gap-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                        isSelected
                          ? 'text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 flex items-center justify-center shrink-0 rounded border transition-colors ${
                          isSelected
                            ? 'bg-zinc-800 border-zinc-800 dark:bg-white dark:border-white'
                            : 'border-zinc-300 dark:border-zinc-600'
                        }`}
                      >
                        {isSelected && (
                          <Check size={10} className="text-white dark:text-zinc-900" />
                        )}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
