import { defineTalentFactory } from '../../generated/fabbrica';

export const TalentFactory = defineTalentFactory({
  defaultData: ({ seq }) => ({ name: `Talent ${seq}` }),
});
