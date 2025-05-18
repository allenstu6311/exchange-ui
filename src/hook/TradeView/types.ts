import { UTCTimestamp } from "lightweight-charts";

export type KlineTuple = [
  number,    // 0: openTime
  string,    // 1: open
  string,    // 2: high
  string,    // 3: low
  string,    // 4: close
  string,    // 5: volume
  number,    // 6: closeTime
  string,    // 7: quoteAssetVolume
  number,    // 8: numberOfTrades
  string,    // 9: takerBuyBaseVolume
  string,    // 10: takerBuyQuoteVolume
  string     // 11: ignore (應忽略該參數)
];

interface IKlineTime {
  year: number
  month: number
  day: number
}
export interface IKlineData {
  time: UTCTimestamp;
  value?: number
  open: number
  high: number
  low: number
  close: number
}

type KlineInterval =
  | '1s'   // 秒
  | '1m' | '3m' | '5m' | '15m' | '30m' // 分鐘
  | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' // 小時
  | '1d' | '3d' // 天
  | '1w'       // 週
  | '1M';      // 月

export interface IKlinesRequest {
  symbol: string;            // e.g. "BTCUSDT"
  interval: KlineInterval;   // e.g. "1m" | "1h" | "1d" ...
  startTime?: number;        // timestamp in milliseconds (可選)
  endTime?: number;          // timestamp in milliseconds (可選)
  timeZone?: string;         // 默認為 "0"
  limit?: number;            // 預設 500，最大 1000（可選）
}