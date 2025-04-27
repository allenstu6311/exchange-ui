export function formatNumToFixed(
  val: number | string | null | undefined,
  digits = 2,
  defaultVal = "--"
): string {
  const num = Number(val);
  return isFinite(num) ? num.toFixed(digits) : defaultVal;
}

export function thousandComma(num: number | string): string {
  return (
    Number(num)?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) ?? "--"
  );
}

export function formatNumWithComma(num: number | string, digits = 2): string {
  const newNum = formatNumToFixed(num, digits);
  return thousandComma(newNum);
}
