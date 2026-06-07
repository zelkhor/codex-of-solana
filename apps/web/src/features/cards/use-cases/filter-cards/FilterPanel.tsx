import type React from 'react';

import { RotateCcw, X } from 'lucide-react';

import {
  CLASSES,
  type ClassT,
  FOILINGS,
  type FoilingT,
  KEYWORDS,
  type KeywordT,
  RARITIES,
  type RarityT,
  SET_GROUPS,
  SUBTYPES,
  type SetT,
  type SubtypeT,
  TALENTS,
  TREATMENTS,
  TYPES,
  type TalentT,
  type TreatmentT,
  type TypeT,
} from '@codex/core';

import { cn } from '@/shared/lib/utils.ts';
import { type NumericComparisonT } from '@/shared/types/comparison-operator.ts';
import { FILTER_MODES, type FilterModeT } from '@/shared/types/filter-mode.ts';
import { ModeToggle } from '@/shared/ui/ModeToggle.tsx';
import { MultiSelect } from '@/shared/ui/MultiSelect.tsx';
import { NumericFilterInput } from '@/shared/ui/NumericFilterInput.tsx';
import { Select } from '@/shared/ui/Select.tsx';
import { Toggle } from '@/shared/ui/Toggle.tsx';

import { HeroFilter } from './HeroFilter.tsx';
import { SearchInput } from './SearchInput.tsx';
import { useFilterPanelViewModel } from './filter-panel.view-model.ts';

const FILTER_MODE_OPTIONS: { value: FilterModeT; label: string }[] = [
  { value: FILTER_MODES.ANY, label: 'Any' },
  { value: FILTER_MODES.EXACT, label: 'Exact' },
];

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
  <div className={cn(`flex items-start gap-3`, className)}>
    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0 w-20 pt-2">
      {label}
    </span>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);

export const FilterPanel = ({ onClose }: FilterPanelProps) => {
  const vm = useFilterPanelViewModel();

  return (
    <div className="p-6 space-y-4">
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
          onClick={vm.reset}
          className="cursor-pointer flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <RotateCcw size={14} />
          Reset all
        </button>
      </div>

      <div className="space-y-3">
        <FilterRow label="Class">
          <div className="space-y-1.5">
            <div className="pt-2">
              <ModeToggle
                options={FILTER_MODE_OPTIONS}
                value={vm.filters.classFilterMode}
                onChange={vm.setClassFilterMode}
              />
            </div>
            <MultiSelect
              options={Object.values(CLASSES)}
              selected={vm.filters.classes}
              onChange={(values) => vm.setClasses(values as ClassT[])}
              placeholder="e.g. Assassin, Brute, Warrior, ..."
            />
          </div>
        </FilterRow>
        <FilterRow label="Talent">
          <div className="space-y-1.5">
            <div className="pt-2">
              <ModeToggle
                options={FILTER_MODE_OPTIONS}
                value={vm.filters.talentFilterMode}
                onChange={vm.setTalentFilterMode}
              />
            </div>
            <MultiSelect
              options={Object.values(TALENTS)}
              selected={vm.filters.talents}
              onChange={(values) => vm.setTalents(values as TalentT[])}
              placeholder="e.g. Earth, Draconic, Mystic, ..."
            />
          </div>
        </FilterRow>
        <FilterRow label="Type">
          <div className="space-y-1.5">
            <div className="pt-2">
              <ModeToggle
                options={FILTER_MODE_OPTIONS}
                value={vm.filters.typeFilterMode}
                onChange={vm.setTypeFilterMode}
              />
            </div>
            <MultiSelect
              options={Object.values(TYPES)}
              selected={vm.filters.types}
              onChange={(values) => vm.setTypes(values as TypeT[])}
              placeholder="e.g. Action, Hero, Weapon, ..."
            />
          </div>
        </FilterRow>
        <FilterRow label="Subtype">
          <div className="space-y-1.5">
            <div className="pt-2">
              <ModeToggle
                options={FILTER_MODE_OPTIONS}
                value={vm.filters.subtypeFilterMode}
                onChange={vm.setSubtypeFilterMode}
              />
            </div>
            <MultiSelect
              options={Object.values(SUBTYPES)}
              selected={vm.filters.subtypes}
              onChange={(values) => vm.setSubtypes(values as SubtypeT[])}
              placeholder="e.g. Arrow, Item, Trap, ..."
            />
          </div>
        </FilterRow>
        <FilterRow label="Keywords">
          <div className="space-y-1.5">
            <div className="pt-2">
              <ModeToggle
                options={FILTER_MODE_OPTIONS}
                value={vm.filters.keywordFilterMode}
                onChange={vm.setKeywordFilterMode}
              />
            </div>
            <MultiSelect
              options={Object.values(KEYWORDS)}
              selected={vm.filters.keywords}
              onChange={(values) => vm.setKeywords(values as KeywordT[])}
              placeholder="e.g. Dominate, Go again, ..."
            />
          </div>
        </FilterRow>
        <FilterRow label="Treatment">
          <div className="space-y-1.5">
            <div className="pt-2">
              <ModeToggle
                options={FILTER_MODE_OPTIONS}
                value={vm.filters.treatmentFilterMode}
                onChange={vm.setTreatmentFilterMode}
              />
            </div>
            <MultiSelect
              options={Object.values(TREATMENTS)}
              selected={vm.filters.treatments}
              onChange={(values) => vm.setTreatments(values as TreatmentT[])}
              placeholder="e.g. Alternate Art, Full Art, ..."
            />
          </div>
        </FilterRow>
        <FilterRow label="Hero" className="pt-4">
          <HeroFilter value={vm.filters.hero} onChange={vm.setHero} />
        </FilterRow>
        <FilterRow label="Set">
          <MultiSelect
            groups={SET_GROUPS.map((g) => ({ label: g.group, options: g.sets }))}
            selected={vm.filters.sets}
            onChange={(values) => vm.setSets(values as SetT[])}
            placeholder="e.g. Dynasty, Armory Deck: Kayo, ..."
          />
        </FilterRow>
        <FilterRow label="Rarity">
          <MultiSelect
            options={Object.values(RARITIES)}
            selected={vm.filters.rarities}
            onChange={(values) => vm.setRarities(values as RarityT[])}
            placeholder="e.g. Promo, Marvel, Rare, ..."
          />
        </FilterRow>
        <FilterRow label="Foiling">
          <MultiSelect
            options={Object.values(FOILINGS)}
            selected={vm.filters.foilings}
            onChange={(values) => vm.setFoilings(values as FoilingT[])}
            placeholder="e.g. Regular, Cold Foil, Rainbow Foil, ..."
          />
        </FilterRow>
        <FilterRow label="Artist">
          <MultiSelect
            options={vm.allArtists}
            selected={vm.filters.artists}
            onChange={(values) => vm.setArtists(values)}
            placeholder="Search artists…"
          />
        </FilterRow>
        <FilterRow label="Cost">
          <NumericFilterInput
            value={vm.filters.cost}
            onChange={(v: NumericComparisonT) => vm.setCostFilter(v)}
          />
        </FilterRow>
        <FilterRow label="Pitch">
          <NumericFilterInput
            value={vm.filters.pitch}
            onChange={(v: NumericComparisonT) => vm.setPitchFilter(v)}
          />
        </FilterRow>
        <FilterRow label="Attack">
          <NumericFilterInput
            value={vm.filters.attack}
            onChange={(v: NumericComparisonT) => vm.setAttackFilter(v)}
          />
        </FilterRow>
        <FilterRow label="Defense">
          <NumericFilterInput
            value={vm.filters.defense}
            onChange={(v: NumericComparisonT) => vm.setDefenseFilter(v)}
          />
        </FilterRow>
      </div>

      <div className="space-y-3 pt-1">
        <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">Sort</h2>
        <div className="flex items-start gap-3">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0 w-20 pt-2">
            Order
          </span>
          <Select
            value={vm.sortOrderValue}
            disabled={vm.isSortDisabled}
            onChange={(v) => vm.setSortOrder(v as never)}
            className="flex-1"
            options={vm.sortOrderOptions}
          />
        </div>
        <Toggle
          label="Group printings"
          checked={vm.filters.groupPrintings}
          onChange={vm.setGroupPrintings}
        />
      </div>
    </div>
  );
};
