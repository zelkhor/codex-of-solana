import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import {
  setClasses,
  setTalents,
  setTypes,
  setKeywords,
  setSets,
  setRarities,
  setFoilings,
  resetFilters,
} from '@/store/filters/filters.slice';
import { selectFilters } from '@/store/filters/filters.selectors';
import {
  CARD_CLASSES,
  CARD_TALENTS,
  CARD_TYPES,
  CARD_KEYWORDS,
  CARD_RARITIES,
  CARD_FOILINGS,
  CARD_SETS,
  type CardClassT,
  type CardTalentT,
  type CardTypeT,
  type CardKeywordT,
  type CardRarityT,
  type CardFoilingT,
  type CardSetT,
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
          onChange={(values) => dispatch(setClasses(values as CardClassT[]))}
        />
      </AccordionSection>

      <AccordionSection label="Talent" badge={f.talents.length}>
        <MultiSelect
          options={Object.values(CARD_TALENTS)}
          selected={f.talents}
          onChange={(values) => dispatch(setTalents(values as CardTalentT[]))}
        />
      </AccordionSection>

      <AccordionSection label="Type" badge={f.types.length}>
        <MultiSelect
          options={Object.values(CARD_TYPES)}
          selected={f.types}
          onChange={(values) => dispatch(setTypes(values as CardTypeT[]))}
        />
      </AccordionSection>

      <AccordionSection label="Keywords" badge={f.keywords.length}>
        <MultiSelect
          options={Object.values(CARD_KEYWORDS)}
          selected={f.keywords}
          onChange={(values) => dispatch(setKeywords(values as CardKeywordT[]))}
        />
      </AccordionSection>

      <AccordionSection label="Rarity" badge={f.rarities.length}>
        <MultiSelect
          options={Object.values(CARD_RARITIES)}
          selected={f.rarities}
          onChange={(values) => dispatch(setRarities(values as CardRarityT[]))}
        />
      </AccordionSection>

      <AccordionSection label="Foiling" badge={f.foilings.length}>
        <MultiSelect
          options={Object.values(CARD_FOILINGS)}
          selected={f.foilings}
          onChange={(values) => dispatch(setFoilings(values as CardFoilingT[]))}
        />
      </AccordionSection>

      <AccordionSection label="Set" badge={f.sets.length}>
        <MultiSelect
          options={Object.values(CARD_SETS)}
          selected={f.sets}
          onChange={(values) => dispatch(setSets(values as CardSetT[]))}
        />
      </AccordionSection>
    </div>
  );
};
