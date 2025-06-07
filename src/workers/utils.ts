import { IBarData, IKlineData, IKlineWsData } from "@/hook/TradeView/types";
import { Ticker24hrStat, TickerSocketData, WsType } from "@/types";
import dayjs from "dayjs";
import { CandlestickData, UTCTimestamp } from "lightweight-charts";

export function transformTickerData(
  raw: TickerSocketData[],
  quote: string = "USDT"
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

export function transformKlineFromWs(data: IKlineWsData): IKlineData {
  const { k } = data;

  return {
    time: Math.floor(k.t / 1000) as UTCTimestamp, // ✅ 轉成秒
    open: parseFloat(k.o),
    high: parseFloat(k.h),
    low: parseFloat(k.l),
    close: parseFloat(k.c),
  };
}

export function transformVolumFromWs(data: IKlineWsData): IBarData {
  const { k } = data;
  return {
    time: Math.floor(k.t / 1000) as UTCTimestamp,
    value: parseFloat(k.v),
    color: parseFloat(k.c) >= parseFloat(k.o) ? "#26a69a" : "#ef5350", // or custom logic
  };
}

export function translfrmKlineData(data: IKlineWsData) {
  return {
    kline: transformKlineFromWs(data),
    bar: transformVolumFromWs(data),
  }
}

export function getMiddlewares(type: WsType) {
  const middleware = [];
  switch (type) {
    case "ticker":
      middleware.push(transformTickerData);
      break;
    case "kline":
      middleware.push(translfrmKlineData);
      break;
    default:
      break;
  }
  return middleware
}
