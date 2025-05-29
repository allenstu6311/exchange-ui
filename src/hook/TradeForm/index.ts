import { RootState } from "@/store";
import { IBalance } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

export function useTradeAvailability(
  balance: IBalance[],
  baseSymbolName: string, // BTC
  quoteSymbolName: string // USDT
) {
  const uppercaseSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.uppercaseSymbol;
  });

  const lastPrice = useSelector((state: RootState) => {
    const targetSymbolTicker = state.ticker24hrData.list.find((item) => {
      return item.symbol === uppercaseSymbol;
    });
    return targetSymbolTicker?.lastPrice || "";
  });
  const [priceSnapshot, setPriceSnapshot] = useState<number>(0);

  useEffect(() => {
    setPriceSnapshot(0);
  }, [uppercaseSymbol]);

  useEffect(() => {
    if (!priceSnapshot) {
      setPriceSnapshot(parseFloat(lastPrice) || 0);
    }
  }, [lastPrice, priceSnapshot]);

  return useMemo(() => {
    const baseAmount = balance.find((item) => item.asset === baseSymbolName);
    const quoteAmount = balance.find((item) => item.asset === quoteSymbolName);

    const baseFree = parseFloat(baseAmount?.free ?? "0");
    const quoteFree = parseFloat(quoteAmount?.free ?? "0");

    const maxBuyQty = priceSnapshot > 0 ? quoteFree / priceSnapshot : 0; // quote 用來買 base
    const maxSellAmount = baseFree * priceSnapshot; // base 拿來賣

    return {
      maxBuyQty, // 最多可買入 baseAsset 的數量
      maxSellAmount, // 最多可賣出 baseAsset 的數量
      quoteFree, // 當前 quote 可用資金
      baseFree,
    };
  }, [balance, baseSymbolName, quoteSymbolName, priceSnapshot]);
}
