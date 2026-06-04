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
  type CardClassT,
  type CardTalentT,
  type CardTypeT,
  type CardSubtypeT,
  type CardKeywordT,
  type CardRarityT,
  type CardFoilingT,
  type CardSetT,
  SET_ORDER,
} from '@codex/core';
import { SearchInput } from '@/components/filters/SearchInput';
import { AccordionSection } from '@/components/ui/AccordionSection';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { NumericFilterInput } from '@/components/ui/NumericFilterInput';
import { RotateCcw, ChevronDown, X } from 'lucide-react';

interface FilterPanelProps {
  onClose?: () => void;
}

export const FilterPanel = ({ onClose }: FilterPanelProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const f = useSelector(selectFilters);

  return (
    <div className="p-6 space-y-5">
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

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">Filters</h2>
        <button
          onClick={() => dispatch(resetFilters())}
          className="cursor-pointer flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <RotateCcw size={14} />
          Reset all
        </button>
      </div>

      <AccordionSection defaultOpen label="Class" badge={f.classes.length}>
        <MultiSelect
          options={Object.values(CARD_CLASSES)}
          selected={f.classes}
          onChange={(values) => dispatch(setClasses(values as CardClassT[]))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Talent" badge={f.talents.length}>
        <MultiSelect
          options={Object.values(CARD_TALENTS)}
          selected={f.talents}
          onChange={(values) => dispatch(setTalents(values as CardTalentT[]))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Rarity" badge={f.rarities.length}>
        <MultiSelect
          options={Object.values(CARD_RARITIES)}
          selected={f.rarities}
          onChange={(values) => dispatch(setRarities(values as CardRarityT[]))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Foiling" badge={f.foilings.length}>
        <MultiSelect
          options={Object.values(CARD_FOILINGS)}
          selected={f.foilings}
          onChange={(values) => dispatch(setFoilings(values as CardFoilingT[]))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Set" badge={f.sets.length}>
        <MultiSelect
          options={SET_ORDER}
          selected={f.sets}
          onChange={(values) => dispatch(setSets(values as CardSetT[]))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Type" badge={f.types.length}>
        <MultiSelect
          options={Object.values(CARD_TYPES)}
          selected={f.types}
          onChange={(values) => dispatch(setTypes(values as CardTypeT[]))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Subtype" badge={f.subtypes.length}>
        <MultiSelect
          options={Object.values(CARD_SUBTYPES)}
          selected={f.subtypes}
          onChange={(values) => dispatch(setSubtypes(values as CardSubtypeT[]))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Keywords" badge={f.keywords.length}>
        <MultiSelect
          options={Object.values(CARD_KEYWORDS)}
          selected={f.keywords}
          onChange={(values) => dispatch(setKeywords(values as CardKeywordT[]))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Cost" badge={f.cost.value !== null ? 1 : 0}>
        <NumericFilterInput
          value={f.cost}
          onChange={(v: NumericFilterT) => dispatch(setCostFilter(v))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Pitch" badge={f.pitch.value !== null ? 1 : 0}>
        <NumericFilterInput
          value={f.pitch}
          onChange={(v: NumericFilterT) => dispatch(setPitchFilter(v))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Attack" badge={f.attack.value !== null ? 1 : 0}>
        <NumericFilterInput
          value={f.attack}
          onChange={(v: NumericFilterT) => dispatch(setAttackFilter(v))}
        />
      </AccordionSection>

      <AccordionSection defaultOpen label="Defense" badge={f.defense.value !== null ? 1 : 0}>
        <NumericFilterInput
          value={f.defense}
          onChange={(v: NumericFilterT) => dispatch(setDefenseFilter(v))}
        />
      </AccordionSection>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">Sort</h2>
        <div className="relative">
          <select
            value={f.searchQuery.trim() ? 'relevance' : f.sortOrder}
            disabled={!!f.searchQuery.trim()}
            onChange={(e) => dispatch(setSortOrder(e.target.value as SortOrderT))}
            className="cursor-pointer appearance-none text-sm bg-zinc-100 dark:bg-zinc-700 rounded-md pl-3 pr-7 py-1 text-zinc-700 dark:text-zinc-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {f.searchQuery.trim() && <option value="relevance">By relevance</option>}
            <option value="set-asc">Set release ↑</option>
            <option value="set-desc">Set release ↓</option>
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
          </select>
          <ChevronDown
            size={13}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400"
          />
        </div>
      </div>
    </div>
  );
};
