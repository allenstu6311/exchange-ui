import { OrderSide, OrderType } from "@/types";
import { OrderResponseType, SelfTradePreventionMode, TimeInForce } from "./shared/types";

export interface IRecentTradesRequest {
  symbol: string;
  limit?: number;
}

export interface IOrderRequest {
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

export interface ICurrentOrderRequest {
  symbol: string;
}

export interface IHistoryOrderRequest {
  symbol: string;
}

// 主請求型別定義
export interface IOrderRequest {
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
