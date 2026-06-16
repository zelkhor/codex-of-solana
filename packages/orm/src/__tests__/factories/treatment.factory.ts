import { defineTreatmentFactory } from '../../generated/fabbrica';

export const TreatmentFactory = defineTreatmentFactory({
  defaultData: ({ seq }) => ({ name: `Treatment ${seq}` }),
});
