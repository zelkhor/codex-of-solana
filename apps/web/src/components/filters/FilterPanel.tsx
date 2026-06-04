import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import {
  setClasses,
  setTalents,
  setTypes,
  setSubtypes,
  setKeywords,
  setSets,
  setRarities,
  setFoilings,
  setSortOrder,
  setCostFilter,
  setPitchFilter,
  setAttackFilter,
  setDefenseFilter,
  setGroupPrintings,
  resetFilters,
  type SortOrderT,
  type NumericFilterT,
} from '@/store/filters/filters.slice';
import { selectFilters } from '@/store/filters/filters.selectors';
import {
  CARD_CLASSES,
  CARD_TALENTS,
  CARD_TYPES,
  CARD_SUBTYPES,
  CARD_KEYWORDS,
  CARD_RARITIES,
  CARD_FOILINGS,
  SET_GROUPS,
  type CardClassT,
  type CardTalentT,
  type CardTypeT,
  type CardSubtypeT,
  type CardKeywordT,
  type CardRarityT,
  type CardFoilingT,
  type CardSetT,
} from '@codex/core';
import { SearchInput } from '@/components/filters/SearchInput';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { NumericFilterInput } from '@/components/ui/NumericFilterInput';
import { RotateCcw, X } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle.tsx';
import { Select } from '@/components/ui/Select.tsx';

interface FilterPanelProps {
  onClose?: () => void;
}

const FilterRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0 w-20 pt-2">
      {label}
    </span>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);

export const FilterPanel = ({ onClose }: FilterPanelProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const f = useSelector(selectFilters);

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
          onClick={() => dispatch(resetFilters())}
          className="cursor-pointer flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <RotateCcw size={14} />
          Reset all
        </button>
      </div>

      <div className="space-y-3">
        <FilterRow label="Class">
          <MultiSelect
            options={Object.values(CARD_CLASSES)}
            selected={f.classes}
            onChange={(values) => dispatch(setClasses(values as CardClassT[]))}
            placeholder="e.g. Assassin, Brute, Warrior, ..."
          />
        </FilterRow>
        <FilterRow label="Talent">
          <MultiSelect
            options={Object.values(CARD_TALENTS)}
            selected={f.talents}
            onChange={(values) => dispatch(setTalents(values as CardTalentT[]))}
            placeholder="e.g. Earth, Draconic, Mystic, ..."
          />
        </FilterRow>
        <FilterRow label="Type">
          <MultiSelect
            options={Object.values(CARD_TYPES)}
            selected={f.types}
            onChange={(values) => dispatch(setTypes(values as CardTypeT[]))}
            placeholder="e.g. Action, Hero, Weapon, ..."
          />
        </FilterRow>
        <FilterRow label="Subtype">
          <MultiSelect
            options={Object.values(CARD_SUBTYPES)}
            selected={f.subtypes}
            onChange={(values) => dispatch(setSubtypes(values as CardSubtypeT[]))}
            placeholder="e.g. Arrow, Item, Trap, ..."
          />
        </FilterRow>
        <FilterRow label="Keywords">
          <MultiSelect
            options={Object.values(CARD_KEYWORDS)}
            selected={f.keywords}
            onChange={(values) => dispatch(setKeywords(values as CardKeywordT[]))}
            placeholder="e.g. Dominate, Go again, ..."
          />
        </FilterRow>
        <FilterRow label="Set">
          <MultiSelect
            groups={SET_GROUPS.map((g) => ({ label: g.group, options: g.sets }))}
            selected={f.sets}
            onChange={(values) => dispatch(setSets(values as CardSetT[]))}
            placeholder="e.g. Dynasty, Armory Deck: Kayo, ..."
          />
        </FilterRow>
        <FilterRow label="Rarity">
          <MultiSelect
            options={Object.values(CARD_RARITIES)}
            selected={f.rarities}
            onChange={(values) => dispatch(setRarities(values as CardRarityT[]))}
            placeholder="e.g. Promo, Marvel, Rare, ..."
          />
        </FilterRow>
        <FilterRow label="Foiling">
          <MultiSelect
            options={Object.values(CARD_FOILINGS)}
            selected={f.foilings}
            onChange={(values) => dispatch(setFoilings(values as CardFoilingT[]))}
            placeholder="e.g. Regular, Cold Foil, Rainbow Foil, ..."
          />
        </FilterRow>
        <FilterRow label="Cost">
          <NumericFilterInput
            value={f.cost}
            onChange={(v: NumericFilterT) => dispatch(setCostFilter(v))}
          />
        </FilterRow>
        <FilterRow label="Pitch">
          <NumericFilterInput
            value={f.pitch}
            onChange={(v: NumericFilterT) => dispatch(setPitchFilter(v))}
          />
        </FilterRow>
        <FilterRow label="Attack">
          <NumericFilterInput
            value={f.attack}
            onChange={(v: NumericFilterT) => dispatch(setAttackFilter(v))}
          />
        </FilterRow>
        <FilterRow label="Defense">
          <NumericFilterInput
            value={f.defense}
            onChange={(v: NumericFilterT) => dispatch(setDefenseFilter(v))}
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
            value={f.searchQuery.trim() ? 'relevance' : f.sortOrder}
            disabled={!!f.searchQuery.trim()}
            onChange={(v) => dispatch(setSortOrder(v as SortOrderT))}
            className="flex-1"
            options={[
              ...(f.searchQuery.trim() ? [{ value: 'relevance', label: 'By relevance' }] : []),
              { value: 'set-asc', label: 'Set release ↑' },
              { value: 'set-desc', label: 'Set release ↓' },
              { value: 'name-asc', label: 'Name A → Z' },
              { value: 'name-desc', label: 'Name Z → A' },
            ]}
          />
        </div>
        <Toggle
          label="Group printings"
          checked={f.groupPrintings}
          onChange={(v) => dispatch(setGroupPrintings(v))}
        />
      </div>
    </div>
  );
};
