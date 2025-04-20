import { DepthTable } from "@/types";

export function handleDepthData(depthData: string[][]): DepthTable[] {
  const maxPrice = Math.max(
    ...depthData
      .map((row) => parseFloat(row[0]))
      .filter((price) => !isNaN(price))
  );

  return depthData.map((item) => {
    const amount = Number(item[0]) * Number(item[1]);
    return {
      price: item[0],
      volume: item[1],
      amount,
      ratio: (amount / maxPrice) * 100,
    };
  });
}
