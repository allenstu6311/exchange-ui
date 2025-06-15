import { RootState } from "@/store";
import { IBalance } from "@/types";
import { div, mul } from "@/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ITradeAvailability } from "./types";

/**
 * 可用、最大買入、最大賣出計算
 */
export function useTradeAvailability(
  balance: IBalance[],
  baseSymbolName: string, // BTC
  quoteSymbolName: string // USDT
): ITradeAvailability {

  const cacheTickerData = useSelector((state: RootState) => {
    return state.ticker24hrData.cacheMap;
  });
  const { lastPrice = "0" } = cacheTickerData;

  return useMemo(() => {
    const baseAmount = balance.find((item) => item.asset === baseSymbolName);
    const quoteAmount = balance.find((item) => item.asset === quoteSymbolName);
    
    const baseFree = parseFloat(baseAmount?.free ?? "0");
    const quoteFree = parseFloat(quoteAmount?.free ?? "0");
    
    const maxBuyQuantity = div<number>(quoteFree, lastPrice, { returnNumber: true })
    const maxSellAmount = mul<number>(baseFree, lastPrice, { returnNumber: true });

    return {
      maxBuyQuantity,
      maxSellAmount,
      quoteFree,
      baseFree,
    };
  }, [balance, baseSymbolName, quoteSymbolName, lastPrice]);
}
