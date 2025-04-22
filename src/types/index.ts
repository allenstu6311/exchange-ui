import { JSX } from "@emotion/react/jsx-runtime";

export interface Ticker24hrStat {
  symbol: string; // 交易對，例如 "ETHBTC"
  priceChange: string; // 價格變化
  priceChangePercent: string; // 價格變化百分比
  weightedAvgPrice: string; // 加權平均價格
  prevClosePrice: string; // 昨日收盤價
  lastPrice: string; // 最新成交價
  lastQty: string; // 最新成交量
  bidPrice: string; // 當前最高買價
  bidQty: string; // 當前買單數量
  askPrice: string; // 當前最低賣價
  askQty: string; // 當前賣單數量
  openPrice: string; // 今日開盤價
  highPrice: string; // 24h 內最高價
  lowPrice: string; // 24h 內最低價
  volume: string; // 成交量（以 base 資產為單位）
  quoteVolume: string; // 成交量（以 quote 資產為單位）
  openTime: number; // 24 小時內統計起始時間（毫秒 timestamp）
  closeTime: number; // 24 小時內統計結束時間（毫秒 timestamp）
  firstId: number; // 第一筆成交 ID
  lastId: number; // 最後一筆成交 ID
  count: number; // 成交筆數
}

interface TableColumns {
  label: string;
  key: string;
  format?: (val: any, item?: any) => string;
  getStyle?: (val: any, item: any) => { [style: string]: string };
  className?: string | ((val: any, item: any) => string);
  render?: (content: any, item: any, index: number) => JSX.Element;
}

export interface CTableProps {
  loading?: boolean;
  rowData: any[];
  columnData: TableColumns[];
  rowStyle?: Record<string, string>;
  trOnClick?: (item: any) => any;
}

export interface KlineParam {
  symbol: string;
  interval: string;
}

export interface DepthResponse {
  asks: string[][];
  bids: string[][];
  lastUpdateId: number;
}

export interface DepthTable {
  price: string;
  volume: string;
  amount: number;
  ratio: number;
}

export interface UseDepthDataParam {
  symbol: string;
  deep: number;
}

export interface TickerSocketData {
  A: string;
  B: string;
  C: number;
  E: number;
  F: number;
  L: number;
  O: number;
  P: string;
  Q: string;
  a: string;
  b: string;
  c: string;
  e: string;
  h: string;
  l: string;
  n: number;
  o: string;
  p: string;
  q: string;
  s: string;
  v: string;
  w: string;
  x: string;
}

export type WorkerRequest = {
  type: "depth" | "ticker" | "kline";
  url: string;
};
