import { IBalance } from "@/types";
import { useMemo } from "react";

export function useTradeAvailability(
  balance: IBalance[],
  baseAssets: string,
  quoteAssets: string,
  currPrice: string
) {
  return useMemo(() => {
    const baseAmount = balance.find((item) => item.asset === baseAssets);
    const quoteAmount = balance.find((item) => item.asset === quoteAssets);

    const baseFree = parseFloat(baseAmount?.free ?? "0");
    const quoteFree = parseFloat(quoteAmount?.free ?? "0");
    const price =
      typeof currPrice === "string" ? parseFloat(currPrice) : currPrice;

    const maxBuyQty = price > 0 ? quoteFree / price : 0; // quote 用來買 base
    const maxSellAmount = baseFree * price; // base 拿來賣

    return {
      maxBuyQty, // 最多可買入 baseAsset 的數量
      maxSellAmount, // 最多可賣出 baseAsset 的數量
      quoteFree, // 當前 quote 可用資金
      baseFree,
    };
  }, [balance, baseAssets, quoteAssets]);
}
