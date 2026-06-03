import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import { setSearchQuery } from '@/store/filters/filters.slice';
import { searchCards } from '@/store/card-catalog/card-catalog.thunks';
import { selectSearchQuery } from '@/store/filters/filters.selectors';
import { useDebounced } from '@/hooks/useDebounced';

export const SearchInput = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector(selectSearchQuery);
  const [value, setValue] = useState(searchQuery);

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  useDebounced(
    () => {
      dispatch(setSearchQuery(value));
      dispatch(searchCards(value));
    },
    300,
    [value],
  );

  return (
    <div className="relative">
      <Search
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search cards…"
        className="w-full rounded-md bg-zinc-100 text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400 pl-8 pr-8 py-2 text-sm outline-none"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-900 dark:text-white hover:opacity-60 transition-opacity"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
