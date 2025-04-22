import { DepthTable } from "@/types";

export function handleDepthData(depthData: string[][]): DepthTable[] {
  // 先計算所有 amount
  const rowsWithAmount = depthData.map((item) => {
    const price = Number(item[0]);
    const volume = Number(item[1]);
    const amount = price * volume;

    return {
      price: item[0],
      volume: item[1],
      amount,
    };
  });

  // 再找出最大 amount 作為比例母數
  const maxAmount = Math.max(
    ...rowsWithAmount.map((row) => row.amount).filter((n) => !isNaN(n))
  );

  // 最後加上 ratio
  return rowsWithAmount.map((row) => ({
    ...row,
    ratio: maxAmount > 0 ? (row.amount / maxAmount) * 100 : 0,
  }));
}
