import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
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
  virtualed?: boolean;
  trHeight?: number;
  isHover?: boolean;
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

export type WsType = "depth" | "ticker" | "kline";

export type WorkerRequest = {
  type: WsType;
  data?: any;
  url?: string;
  param?: any;
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

  /** 過濾規則清單（如 PRICE_FILTER、LOT_SIZE 等） */
  filters: any[]; // 若要精細可改為 discriminated union

  /** 權限集合（通常是 [["SPOT"]]） */
  permissionSets: string[][];

  /** 權限（通常是 ["SPOT"] 或 ["MARGIN"]） */
  permissions: string[];

  /** 預設的防自成交機制（如 EXPIRE_MAKER） */
  defaultSelfTradePreventionMode: string;

  /** 支援的防自成交機制列表 */
  allowedSelfTradePreventionModes: string[];

  /** 報價精度（可能已被棄用） */
  quotePrecision: number;
}

export interface SymbolInfoListState {
  list: ISymbolInfoWithPrecision[];
  currentSymbolInfo: ISymbolInfoWithPrecision;
}

export interface Ticker24hrDataStatMap {
  map: Ticker24hrStat;
  list: Ticker24hrStat[];
  cacheMap: Ticker24hrStat;
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

// ENUM 定義（需根據實際 API 枚舉值進一步擴充）
export enum OrderSide {
  BUY = "BUY",
  SELL = "SELL",
}
export type OrderType =
  | "LIMIT"
  | "MARKET"
  | "STOP_LOSS"
  | "STOP_LOSS_LIMIT"
  | "TAKE_PROFIT"
  | "TAKE_PROFIT_LIMIT";
type TimeInForce = "GTC" | "IOC" | "FOK";
type OrderResponseType = "ACK" | "RESULT" | "FULL";
type SelfTradePreventionMode =
  | "NONE"
  | "EXPIRE_TAKER"
  | "EXPIRE_MAKER"
  | "EXPIRE_BOTH"; // 根據實際 STP 支援擴充

// 主請求型別定義
export interface OrderRequest {
  symbol: string; // 交易對名稱，如 BTCUSDT
  side: OrderSide; // 訂單方向
  type: OrderType; // 訂單類型
  timeInForce?: TimeInForce; // 生效時間策略
  quantity?: number | string; // 購買數量
  quoteOrderQty?: number; // 使用報價幣種的金額下單
  price?: number | string; // 價格
  newClientOrderId?: string; // 自定義訂單 ID
  strategyId?: number; // 策略 ID
  strategyType?: number; // 策略類型，需大於等於 1000000
  stopPrice?: number; // 觸發價格，僅部分訂單類型適用
  trailingDelta?: number; // 追蹤止損距離
  icebergQty?: number; // 冰山訂單的顯示數量
  newOrderRespType?: OrderResponseType; // 訂單響應類型
  selfTradePreventionMode?: SelfTradePreventionMode; // 防止自成交模式
  recvWindow?: number; // 接收視窗
  timestamp: number; // 當前時間戳（毫秒）
}

type CancelRestrictions = "ONLY_NEW" | "ONLY_PARTIALLY_FILLED";

export interface ICancelOrderRequest {
  symbol: string;
  orderId?: number;
  origClientOrderId?: string;
  newClientOrderId?: string;
  cancelRestrictions?: CancelRestrictions;
  recvWindow?: number;
  timestamp: number;
  side?: OrderSide;
}

export interface ICurrentOrder {
  symbol: string; // 交易對，例如 "ETHUSDT"
  orderId: number; // 訂單 ID
  orderListId: number; // OCO ID，沒用到會是 -1
  clientOrderId: string; // 使用者自定義的訂單 ID
  price: string; // 價格（字串格式）
  origQty: string; // 原始下單數量
  executedQty: string; // 已成交數量
  cumulativeQuoteQty: string; // 已成交總額（以 quote asset 計算）
  status:
    | "NEW"
    | "PARTIALLY_FILLED"
    | "FILLED"
    | "CANCELED"
    | "REJECTED"
    | "EXPIRED";
  timeInForce: "GTC" | "IOC" | "FOK";
  type:
    | "LIMIT"
    | "MARKET"
    | "STOP_LOSS"
    | "STOP_LOSS_LIMIT"
    | "TAKE_PROFIT"
    | "TAKE_PROFIT_LIMIT"
    | "LIMIT_MAKER";
  side: "BUY" | "SELL";
  stopPrice: string; // 停損價格（沒有則為 "0.00000000"）
  icebergQty: string; // 冰山訂單可見數量
  time: number; // 建立時間（timestamp 毫秒）
  updateTime: number; // 最後更新時間（timestamp 毫秒）
  isWorking: boolean; // 是否為有效訂單
  workingTime: number; // 生效時間（timestamp 毫秒）
  origQuoteOrderQty: string; // 原始下單的 quote 數量（只有市價單會用）
  selfTradePreventionMode?:
    | "EXPIRE_TAKER"
    | "EXPIRE_MAKER"
    | "EXPIRE_BOTH"
    | "NONE"; // 只有開啟 STP 的帳號會有
}

export interface ICurrentOrderRequest {
  symbol: string;
}

export interface IHistoryOrderRequest {
  symbol: string;
}

export interface IBalance {
  asset: string;
  free: string;
  locked: string;
}

export interface ICommissionRates {
  maker: string;
  taker: string;
  buyer: string;
  seller: string;
}

export interface IAccountInfo {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  commissionRates: ICommissionRates;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  brokered: boolean;
  requireSelfTradePrevention: boolean;
  preventSor: boolean;
  updateTime: number;
  accountType: "SPOT" | string;
  balances: IBalance[];
  permissions: string[];
  uid: number;
}

export type NumberString = string | number;
