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

/**
 * Binance /api/v3/exchangeInfo 的完整回傳格式
 */
export interface ExchangeInfoResponse {
  /** 伺服器當前時間（UNIX 毫秒時間戳） */
  serverTime: number;

  /** 伺服器時區，預設為 "UTC" */
  timezone: string;

  /**
   * 系統層級的請求限制設定（如一分鐘內最大請求次數等）
   */
  rateLimits: any[];

  /**
   * 系統層級的全域過濾器（目前大多為空陣列）
   */
  exchangeFilters: any[];

  /**
   * 所有交易對的設定清單
   */
  symbols: SymbolInfoListTypes[];
}

/**
 * Binance 單一交易對的詳細交易設定資訊
 */
export interface SymbolInfoListTypes {
  /** 交易對代碼（例如：BTCUSDT） */
  symbol: string;

  /** 狀態（通常為 TRADING 表示可交易） */
  status: "TRADING" | "BREAK" | "PENDING_LISTING" | string;

  /** 該交易對的基礎資產（如 BTC） */
  baseAsset: string;

  /** 基礎資產小數精度（下單精度） */
  baseAssetPrecision: number;

  /** 該交易對的報價資產（如 USDT） */
  quoteAsset: string;

  /** 報價資產小數精度 */
  quoteAssetPrecision: number;

  /** 基礎資產的手續費精度 */
  baseCommissionPrecision: number;

  /** 報價資產的手續費精度 */
  quoteCommissionPrecision: number;

  /** 可用的下單類型（如 LIMIT、MARKET、STOP_LOSS 等） */
  orderTypes: string[];

  /** 是否允許冰山單（Iceberg order） */
  icebergAllowed: boolean;

  /** 是否允許 OCO（One Cancels the Other）單 */
  ocoAllowed: boolean;

  /** 是否允許現貨交易（spot trading） */
  isSpotTradingAllowed: boolean;

  /** 是否允許槓桿交易（margin trading） */
  isMarginTradingAllowed: boolean;

  /** 是否允許以報價資產下市價單（quote order market） */
  quoteOrderQtyMarketAllowed: boolean;

  /** 是否允許追蹤停損（trailing stop） */
  allowTrailingStop: boolean;

  /** 是否允許取消後再掛單 */
  cancelReplaceAllowed: boolean;

  /** 是否允許修改訂單（amend） */
  amendAllowed: boolean;

  /**
   * 過濾規則清單（如 PRICE_FILTER、LOT_SIZE 等）
   * 結構依照 filterType 不同有所變化
   */
  filters: any[]; // 可視需求細化為 discriminated union 型別

  /** 權限集合（通常是 [["SPOT"]]） */
  permissionSets: string[][];

  /** 權限（通常是 ["SPOT"] 或 ["MARGIN"]） */
  permissions: string[];

  /** 預設的防自成交機制（如 EXPIRE_MAKER） */
  defaultSelfTradePreventionMode: string;

  /** 支援的防自成交機制列表 */
  allowedSelfTradePreventionModes: string[];
}
export interface SymbolInfoListState {
  list: SymbolInfoListTypes[];
}

export interface Ticker24hrDataStatMap {
  map: Ticker24hrStat;
}

export interface SymbolNameMapType {
  base: string;
  quote: string;
  lowercaseSymbol: string;
  uppercaseSymbol: string;
  /**
   * BTC/USDT
   */
  slashSymbol: string;
}
