import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { resetFilters } from '@/store/filters/filters.slice';

export const NoFilterResults = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4 select-none">
      <svg viewBox="0 0 200 190" className="w-44 h-44 text-zinc-400 dark:text-zinc-600">
        {/* fanned cards */}
        <rect
          x="70"
          y="28"
          width="60"
          height="86"
          rx="6"
          transform="rotate(-16 100 71)"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
        <rect
          x="70"
          y="28"
          width="60"
          height="86"
          rx="6"
          transform="rotate(16 100 71)"
          fill="currentColor"
          fillOpacity="0.08"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
        <rect
          x="70"
          y="22"
          width="60"
          height="86"
          rx="6"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />

        {/* magnifying glass */}
        <circle
          cx="97"
          cy="78"
          r="34"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="3"
        />
        <line
          x1="122"
          y1="103"
          x2="148"
          y2="130"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* X inside lens */}
        <line
          x1="84"
          y1="65"
          x2="110"
          y2="91"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1="110"
          y1="65"
          x2="84"
          y2="91"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* sparkles */}
        <path
          d="M36 52 L38 44 L40 52 L48 54 L40 56 L38 64 L36 56 L28 54Z"
          fill="#818cf8"
          fillOpacity="0.5"
        />
        <path
          d="M158 30 L159.5 25 L161 30 L166 31.5 L161 33 L159.5 38 L158 33 L153 31.5Z"
          fill="#f59e0b"
          fillOpacity="0.55"
        />
        <circle cx="30" cy="128" r="3.5" fill="#10b981" fillOpacity="0.45" />
        <circle cx="168" cy="118" r="2.5" fill="#818cf8" fillOpacity="0.4" />
        <circle cx="155" cy="155" r="2" fill="#f59e0b" fillOpacity="0.4" />
        <circle cx="42" cy="160" r="2" fill="#e879f9" fillOpacity="0.4" />
      </svg>

      <div className="text-center space-y-2 max-w-xs">
        <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
          No cards match your filters
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Try adjusting or clearing your filters to see more results.
        </p>
      </div>

      <button
        onClick={() => dispatch(resetFilters())}
        className="cursor-pointer px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
      >
        Reset filters
      </button>
    </div>
  );
};
