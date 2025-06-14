export const isNumber = (value: any): value is number => {
  return typeof value === "number" && !isNaN(value);
};

export const validatePrecision = (precision: number, value: string): boolean => {
  const reg = new RegExp(`^\\d*\\.?\\d{0,${precision}}$`);
  return reg.test(value)
}
