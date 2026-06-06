import { Search, X } from 'lucide-react';

import { useSearchInputViewModel } from './search-input.view-model.ts';

export const SearchInput = () => {
  const vm = useSearchInputViewModel();

  return (
    <div className="relative">
      <Search
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
      />
      <input
        type="text"
        value={vm.value}
        onChange={(e) => vm.onChange(e.target.value)}
        placeholder="Search cards…"
        className="w-full rounded-md bg-zinc-100 text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400 pl-8 pr-8 py-2.5 sm:py-2 text-base sm:text-sm outline-none"
      />
      {vm.value && (
        <button
          onClick={vm.onClear}
          aria-label="Clear search"
          className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-900 dark:text-white hover:opacity-60 transition-opacity"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
