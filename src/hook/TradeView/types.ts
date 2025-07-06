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
export interface IBarData {
  time: UTCTimestamp;
  value: number;
  color: string;
}
