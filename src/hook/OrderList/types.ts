export interface IHistoryOrderData {
  /** 交易對，如 "ETHUSDT" */
  symbol: string;

  /** 成交 ID（全域唯一） */
  id: number;

  /** 該筆成交所屬的訂單 ID */
  orderId: number;

  /** 訂單列表 ID（通常為 OCO 訂單編號，若非 OCO 則為 -1） */
  orderListId: number;

  /** 成交價格（字串型態，保留精度） */
  price: string;

  /** 成交數量（基礎資產數量） */
  qty: string;

  /** 成交總額（以報價資產計） */
  quoteQty: string;

  /** 手續費金額 */
  commission: string;

  /** 手續費計價資產（如 "ETH"） */
  commissionAsset: string;

  /** 成交時間（毫秒 timestamp） */
  time: number;

  /** 是否為買方（true 表示你是 taker/buyer） */
  isBuyer: boolean;

  /** 是否為掛單方（true 表示你是 maker） */
  isMaker: boolean;

  /** 是否為最佳撮合 */
  isBestMatch: boolean;
}
