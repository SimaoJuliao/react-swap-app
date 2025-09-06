import type { SlippageProps } from "./slippage";

export const useSlippageHelper = (props: SlippageProps) => {
  const { value, onChange } = props;

  const handleOnchangeSlippage = (value: string) => {
    // Regex para validar até 2 inteiros e 1 decimal
    const regex = /^\d{0,2}(\.\d{0,1})?$/;

    if (regex.test(value)) {
      const parsed = parseFloat(value);
      onChange(parsed);
    }
  };

  return {
    value,
    onchangeSlippage: handleOnchangeSlippage,
  };
};
