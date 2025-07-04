import { IBarData, IKlineData, IKlineWsData } from "@/hook/TradeView/types";
import { Ticker24hrStat, TickerSocketData, WsType } from "@/types";
import WebSocketIn from "@/webSocket";
import dayjs from "dayjs";
import { CandlestickData, UTCTimestamp } from "lightweight-charts";

interface ITickerSocketDataRaw {
  data: TickerSocketData[];
}

interface IKlineWsDataRaw {
  data: IKlineWsData;
}

export function transformTickerData(
  raw: ITickerSocketDataRaw,
  quote: string = "USDT"
): Partial<Ticker24hrStat>[] {
  if (!raw || !raw.data) return [];

  return raw.data
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

export function translfrmKlineData(raw: IKlineWsDataRaw) {
  if (!raw || !raw.data)
    return {
      kline: [],
      bar: [],
    };
  return {
    kline: transformKlineFromWs(raw.data),
    bar: transformVolumFromWs(raw.data),
  };
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
  return middleware;
}

// WebSocket 消息發送模組化函數
export function createUnsubscribeMessage(params: any): string {
  return JSON.stringify({
    method: "UNSUBSCRIBE",
    params,
    id: Date.now(),
  });
}

export function createSubscribeMessage(params: any): string {
  return JSON.stringify({
    method: "SUBSCRIBE",
    params,
    id: Date.now(),
  });
}

export function sendUnsubscribeMessage(ws: WebSocketIn , params: any): void {
  const message = createUnsubscribeMessage(params);
  console.log("UNSUBSCRIBE", ws?.sendMessage);
  ws?.sendMessage(message);
}

export function sendSubscribeMessage(ws: WebSocketIn , params: any): void {
  const message = createSubscribeMessage(params);
  console.log("SUBSCRIBE", ws);
  ws?.sendMessage(message);
}
