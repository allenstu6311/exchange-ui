export interface IWsRecentTradesResponse {
    data: {
        e: "trade";         // 事件類型，固定為 "trade"
        E: number;          // 事件時間戳 (Event time)
        s: string;          // 交易對 (Symbol)，如 "ETHUSDT"
        t: number;          // 成交 ID (Trade ID)
        p: string;          // 成交價格 (Price)
        q: string;          // 成交數量 (Quantity)
        b: number;          // 買方訂單 ID (Buyer order ID)
        a: number;          // 賣方訂單 ID (Seller order ID)
        T: number;          // 成交時間 (Trade time)
        m: boolean;         // 是否為賣方主動 (true = 賣方主動)
        M: boolean;         // 忽略，始終為 true
    }
}

export interface IWsTickerSocketData {
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