export function formatNumToFixed(
    val: number | string | null | undefined,
    digits = 2,
    defaultVal = '--'
  ): string {
    const num = Number(val)
    return isFinite(num) ? num.toFixed(digits) : defaultVal
  }