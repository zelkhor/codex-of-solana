import { defineKeywordFactory } from '../../generated/fabbrica';

export const KeywordFactory = defineKeywordFactory({
  defaultData: ({ seq }) => ({ name: `Keyword ${seq}` }),
});
