import { Ticker24hrStat, TickerSocketData } from "@/types";

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

export function transformTickerData(
  raw: TickerSocketData[],
  quote: string = 'USDT'
): Partial<Ticker24hrStat>[] {
  return raw
    .map((item: TickerSocketData) => {
      return {
        symbol: item.s,
        priceChange: item.p,
        priceChangePercent: item.P,
        lastPrice: item.c,
        bidPrice: item.b,
        askPrice: item.a,
        highPrice: item.h,
        lowPrice: item.l,
        volume: item.v,
        quoteVolume: item.q,
        time: item.E,
      };
    })
    .filter((item) => item.symbol.endsWith(quote));
}
