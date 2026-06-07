import type React from 'react';
import { useDispatch } from 'react-redux';

import { RotateCcw, X } from 'lucide-react';

import { cn } from '@/shared/lib/utils.ts';
import type { AppDispatch } from '@/shared/store';

import { resetFilters } from '@/domain/filter/application/filters.slice.ts';

import { ArtistFilter } from '../ArtistFilter/ArtistFilter.tsx';
import { AttackFilter } from '../AttackFilter/AttackFilter.tsx';
import { ClassFilter } from '../ClassFilter/ClassFilter.tsx';
import { CostFilter } from '../CostFilter/CostFilter.tsx';
import { DefenseFilter } from '../DefenseFilter/DefenseFilter.tsx';
import { FoilingFilter } from '../FoilingFilter/FoilingFilter.tsx';
import { FormatFilter } from '../FormatFilter/FormatFilter.tsx';
import { HeroFilter } from '../HeroFilter/HeroFilter.tsx';
import { KeywordFilter } from '../KeywordFilter/KeywordFilter.tsx';
import { PitchFilter } from '../PitchFilter/PitchFilter.tsx';
import { RarityFilter } from '../RarityFilter/RarityFilter.tsx';
import { SearchInput } from '../SearchInput/SearchInput.tsx';
import { SetFilter } from '../SetFilter/SetFilter.tsx';
import { SortSection } from '../SortSection/SortSection.tsx';
import { SubtypeFilter } from '../SubtypeFilter/SubtypeFilter.tsx';
import { TalentFilter } from '../TalentFilter/TalentFilter.tsx';
import { TreatmentFilter } from '../TreatmentFilter/TreatmentFilter.tsx';
import { TypeFilter } from '../TypeFilter/TypeFilter.tsx';

interface FilterPanelProps {
  onClose?: () => void;
}

const FilterRow = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('flex items-start gap-3', className)}>
    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0 w-20 pt-2">
      {label}
    </span>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);

export const FilterPanel = ({ onClose }: FilterPanelProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="px-6 pt-6 pb-32 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchInput />
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="cursor-pointer shrink-0 p-2 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">Filters</h2>
        <button
          onClick={() => dispatch(resetFilters())}
          className="cursor-pointer flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <RotateCcw size={14} />
          Reset all
        </button>
      </div>

      <div className="space-y-3">
        <FilterRow label="Class">
          <ClassFilter />
        </FilterRow>
        <FilterRow label="Talent">
          <TalentFilter />
        </FilterRow>
        <FilterRow label="Type">
          <TypeFilter />
        </FilterRow>
        <FilterRow label="Subtype">
          <SubtypeFilter />
        </FilterRow>
        <FilterRow label="Keywords">
          <KeywordFilter />
        </FilterRow>
        <FilterRow label="Treatment">
          <TreatmentFilter />
        </FilterRow>
        <FilterRow label="Format" className="pt-4">
          <FormatFilter />
        </FilterRow>
        <FilterRow label="Hero">
          <HeroFilter />
        </FilterRow>
        <FilterRow label="Set">
          <SetFilter />
        </FilterRow>
        <FilterRow label="Rarity">
          <RarityFilter />
        </FilterRow>
        <FilterRow label="Foiling">
          <FoilingFilter />
        </FilterRow>
        <FilterRow label="Artist">
          <ArtistFilter />
        </FilterRow>
        <FilterRow label="Cost">
          <CostFilter />
        </FilterRow>
        <FilterRow label="Pitch">
          <PitchFilter />
        </FilterRow>
        <FilterRow label="Attack">
          <AttackFilter />
        </FilterRow>
        <FilterRow label="Defense">
          <DefenseFilter />
        </FilterRow>
      </div>

      <SortSection />
    </div>
  );
};
