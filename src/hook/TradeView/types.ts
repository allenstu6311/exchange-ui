import { UTCTimestamp } from "lightweight-charts";

export type KlineTuple = [
  number, // 0: openTime - 開盤時間（毫秒時間戳）
  string, // 1: open - 開盤價
  string, // 2: high - 最高價
  string, // 3: low - 最低價
  string, // 4: close - 收盤價（本 K 線未結束時為最新價格）
  string, // 5: volume - 成交量（base 資產數量）
  number, // 6: closeTime - 收盤時間（毫秒時間戳）
  string, // 7: quoteAssetVolume - 成交金額（quote 資產數量）
  number, // 8: numberOfTrades - 成交筆數
  string, // 9: takerBuyBaseVolume - 主動買入的成交量（以 base 計）
  string, // 10: takerBuyQuoteVolume - 主動買入的成交金額（以 quote 計）
  string // 11: ignore - 忽略欄位（官方保留，無實際用途）
];

interface IKlineTime {
  year: number;
  month: number;
  day: number;
}
export interface IKlineData {
  time: UTCTimestamp;
  value?: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

type KlineInterval =
  | "1s" // 秒
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m" // 分鐘
  | "1h"
  | "2h"
  | "4h"
  | "6h"
  | "8h"
  | "12h" // 小時
  | "1d"
  | "3d" // 天
  | "1w" // 週
  | "1M"; // 月

export interface IKlinesRequest {
  symbol: string; // e.g. "BTCUSDT"
  interval: KlineInterval; // e.g. "1m" | "1h" | "1d" ...
  startTime?: number; // timestamp in milliseconds (可選)
  endTime?: number; // timestamp in milliseconds (可選)
  timeZone?: string; // 默認為 "0"
  limit?: number; // 預設 500，最大 1000（可選）
}

export interface IKlineWsData {
  e: "kline"; // 事件類型
  E: number; // 事件時間（ms）
  s: string; // 交易對 (symbol)，例如 "BTCUSDT"
  k: IKlineWsDataContent; // K 線資料本體
}

export interface IKlineWsDataContent {
  t: number; // 開盤時間 (ms)
  T: number; // 收盤時間 (ms)
  s: string; // 交易對
  i: string; // K 線間隔，例如 "1d"
  f: number; // 本K線起始的成交ID
  L: number; // 本K線結束的成交ID
  o: string; // 開盤價
  c: string; // 收盤價
  h: string; // 最高價
  l: string; // 最低價
  v: string; // 成交量（base 資產數量，例如 BTC）
  n: number; // 成交筆數
  x: boolean; // 該K線是否已結束（true為結束）
  q: string; // 成交金額（quote 資產數量，例如 USDT）
  V: string; // 主動買入的成交量（以 base 計）
  Q: string; // 主動買入的成交金額（以 quote 計）
  B: string; // 忽略欄位，保留用
}

export interface IBarData {
  time: UTCTimestamp;
  value: number;
  color: string;
}
