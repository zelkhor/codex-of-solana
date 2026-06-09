import { KEYWORDS, type KeywordT } from '@codex/core';

import { type FilterModeT } from '@/shared/types/filter-mode.ts';

import { setKeywordFilterMode, setKeywords } from '@/domain/filter/application/filters.slice.ts';
import { selectFilters } from '@/domain/filter/domain/select-filters.selector.ts';
import { useAppDispatch, useAppSelector } from '@/domain/store';

export const useKeywordsFilterViewModel = () => {
  const dispatch = useAppDispatch();
  const { keywords, keywordFilterMode } = useAppSelector(selectFilters);

  return {
    options: Object.values(KEYWORDS),
    keywords,
    keywordFilterMode,
    setKeywords: (v: string[]) => dispatch(setKeywords(v as KeywordT[])),
    setKeywordFilterMode: (v: FilterModeT) => dispatch(setKeywordFilterMode(v)),
  };
};
