export interface IRecentTradesResponse {
    id: number;
    isBestMatch: boolean; //是否為最佳撮合
    isBuyerMaker: boolean; //是否為買方為 maker（true 表示賣方主動）
    price: string;     // 成交價格（字串表示以保精度）
    qty: string;       // 成交數量
    quoteQty: string;  // 成交額（等於 price * qty）
    time: number;      // 成交時間戳（毫秒）
}