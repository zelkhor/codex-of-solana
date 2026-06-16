import { defineEditionFactory } from '../../generated/fabbrica';

export const EditionFactory = defineEditionFactory({
  defaultData: ({ seq }) => ({ name: `Edition ${seq}` }),
});
