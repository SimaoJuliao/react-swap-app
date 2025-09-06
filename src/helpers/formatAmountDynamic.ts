export const formatAmountDynamic = (value: string | null) => {
    if (!value) return "0";
  
    const num = parseFloat(value);
  
    if (isNaN(num)) return null;
  
    const decimals = num > 1 ? 2 : 6;
  
    return num.toFixed(decimals);
  }