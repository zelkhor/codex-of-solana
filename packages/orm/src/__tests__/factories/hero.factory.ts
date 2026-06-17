import { defineHeroFactory } from '../../generated/fabbrica';

export const HeroFactory = defineHeroFactory({
  defaultData: ({ seq }) => ({ name: `Hero ${seq}` }),
});
