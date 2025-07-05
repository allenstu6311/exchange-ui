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