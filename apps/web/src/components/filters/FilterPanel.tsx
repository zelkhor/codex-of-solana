import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import {
  setClasses,
  setTalents,
  setTypes,
  setKeywords,
  setSets,
  setRarities,
  resetFilters,
} from '@/store/filters/filters.slice';
import { selectFilters } from '@/store/filters/filters.selectors';
import {
  CARD_CLASSES,
  CARD_TALENTS,
  CARD_TYPES,
  CARD_KEYWORDS,
  CARD_RARITIES,
  MAIN_SETS,
} from '@codex/shared';
import { SearchInput } from '@/components/filters/SearchInput';
import { AccordionSection } from '@/components/ui/AccordionSection';
import { MultiSelect } from '@/components/ui/MultiSelect';

export const FilterPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const f = useSelector(selectFilters);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between pr-10">
        <h2 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Filters</h2>
        <button
          onClick={() => dispatch(resetFilters())}
          className="text-xs text-zinc-500 dark:text-zinc-400 underline"
        >
          Reset all
        </button>
      </div>

      <SearchInput />

      <AccordionSection label="Class" badge={f.classes.length}>
        <MultiSelect
          options={Object.values(CARD_CLASSES)}
          selected={f.classes}
          onChange={(values) => dispatch(setClasses(values))}
        />
      </AccordionSection>

      <AccordionSection label="Talent" badge={f.talents.length}>
        <MultiSelect
          options={Object.values(CARD_TALENTS)}
          selected={f.talents}
          onChange={(values) => dispatch(setTalents(values))}
        />
      </AccordionSection>

      <AccordionSection label="Type" badge={f.types.length}>
        <MultiSelect
          options={Object.values(CARD_TYPES)}
          selected={f.types}
          onChange={(values) => dispatch(setTypes(values))}
        />
      </AccordionSection>

      <AccordionSection label="Keywords" badge={f.keywords.length}>
        <MultiSelect
          options={Object.values(CARD_KEYWORDS)}
          selected={f.keywords}
          onChange={(values) => dispatch(setKeywords(values))}
        />
      </AccordionSection>

      <AccordionSection label="Rarity" badge={f.rarities.length}>
        <MultiSelect
          options={Object.values(CARD_RARITIES)}
          selected={f.rarities}
          onChange={(values) => dispatch(setRarities(values))}
        />
      </AccordionSection>

      <AccordionSection label="Set" badge={f.sets.length}>
        <div className="flex flex-wrap gap-1">
          {MAIN_SETS.map((set) => (
            <button
              key={set}
              onClick={() => {
                const next = f.sets.includes(set)
                  ? f.sets.filter((s) => s !== set)
                  : [...f.sets, set];
                dispatch(setSets(next));
              }}
              className={`text-xs px-2 py-0.5 rounded ${
                f.sets.includes(set)
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
              }`}
            >
              {set}
            </button>
          ))}
        </div>
      </AccordionSection>
    </div>
  );
};
