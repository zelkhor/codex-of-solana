import { defineRarityFactory } from '../../generated/fabbrica';

export const RarityFactory = defineRarityFactory({
  defaultData: ({ seq }) => ({ name: `Rarity ${seq}` }),
});
