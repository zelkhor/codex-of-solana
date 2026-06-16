import { defineSetGroupFactory } from '../../generated/fabbrica';

export const SetGroupFactory = defineSetGroupFactory({
  defaultData: ({ seq }) => ({ name: `Group ${seq}` }),
});
