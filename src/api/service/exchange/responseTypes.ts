import { OrderSide } from "./shared/enum";
import { OrderResponseType, OrderType, SelfTradePreventionMode, TimeInForce } from "./shared/types";

export interface IRecentTradesResponse {
    id: number;
    isBestMatch: boolean; //是否為最佳撮合
    isBuyerMaker: boolean; //是否為買方為 maker（true 表示賣方主動）
    price: string;     // 成交價格（字串表示以保精度）
    qty: string;       // 成交數量
    quoteQty: string;  // 成交額（等於 price * qty）
    time: number;      // 成交時間戳（毫秒）
}

export interface ITicker24hrStatResponse {
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

export interface IDepthResponse {
    asks: string[][];
    bids: string[][];
    lastUpdateId: number;
}


/**
 * Binance 單一交易對的詳細交易設定資訊
 */
export interface ISymbolInfoListTypes {
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

/**
 * Binance /api/v3/exchangeInfo 的完整回傳格式
 */
export interface IExchangeInfoResponse {
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
    symbols: ISymbolInfoListTypes[];
}

export interface ICurrentOrderResponse {
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

export interface IAccountInfoResponse {
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