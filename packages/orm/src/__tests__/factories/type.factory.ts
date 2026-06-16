import { defineTypeFactory } from '../../generated/fabbrica';

export const TypeFactory = defineTypeFactory({
  defaultData: ({ seq }) => ({ name: `Type ${seq}` }),
});
