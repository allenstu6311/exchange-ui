import { RootState } from "@/store";
import { IBalance } from "@/types";
import { div, mul } from "@/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ITradeAvailability } from "./types";
import { ISymbolInfoWithPrecision } from "../Market/types";

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
  const currSymbolInfo: ISymbolInfoWithPrecision = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.currentSymbolInfo;
    }
  );

  const { lastPrice = "0" } = cacheTickerData;
  const { showPrecision = 0, tradePrecision = 0 } = currSymbolInfo;

  return useMemo(() => {
    const baseAmount = balance.find((item) => item.asset === baseSymbolName);
    const quoteAmount = balance.find((item) => item.asset === quoteSymbolName);

    const baseFree = parseFloat(baseAmount?.free ?? "0");
    const quoteFree = parseFloat(quoteAmount?.free ?? "0");

    const maxBuyQuantity = div<number>(quoteFree, lastPrice, {
      returnNumber: true,
      precision: showPrecision,
    });

    const maxSellAmount = mul<number>(baseFree, lastPrice, {
      // returnNumber: true,
      precision: tradePrecision,
    });

    return {
      maxBuyQuantity,
      maxSellAmount,
      quoteFree,
      baseFree,
    };
  }, [
    balance,
    baseSymbolName,
    quoteSymbolName,
    lastPrice,
    showPrecision,
    tradePrecision,
  ]);
}
