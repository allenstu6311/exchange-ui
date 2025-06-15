export interface ITradeAvailability {
    /**
     * 最大買入
     */
    maxBuyQuantity: number
    /**
     * 最大賣出
     */
    maxSellAmount: number
    /**
     * 可用價值
     */
    quoteFree: number
    /**
     * 可用數量
     */
    baseFree: number
}

export enum TabsType {
    SPOT = 0,
    CROSS = 1,
}