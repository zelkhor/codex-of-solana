import { defineSubtypeFactory } from '../../generated/fabbrica';

export const SubtypeFactory = defineSubtypeFactory({
  defaultData: ({ seq }) => ({ name: `Subtype ${seq}` }),
});
