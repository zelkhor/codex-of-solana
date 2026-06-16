import { defineFormatFactory } from '../../generated/fabbrica';

export const FormatFactory = defineFormatFactory({
  defaultData: ({ seq }) => ({ name: `Format ${seq}` }),
});
