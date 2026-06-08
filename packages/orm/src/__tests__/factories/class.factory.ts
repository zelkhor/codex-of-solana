import { defineClassFactory } from '../../generated/fabbrica';

export const ClassFactory = defineClassFactory({
  defaultData: ({ seq }) => ({ name: `Class ${seq}` }),
});
