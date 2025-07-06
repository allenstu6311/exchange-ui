import { IOrderRequest, OrderSide, OrderType } from "@/types";

export function createDefaultOrderRequest(params: {
  side: OrderSide;
  symbol: string;
  price?: number | string;
  quantity?: number | string;
  type: OrderType;
}): IOrderRequest {
  return {
    symbol: params.symbol,
    side: params.side,
    type: params.type, // 你也可以改成參數傳入
    timeInForce: "GTC",
    timestamp: Date.now(),
    recvWindow: 5000,
    price: params.price ?? '',
    quantity: params.quantity ?? '',
  };
}
