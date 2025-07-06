export type OrderType =
    | "LIMIT"
    | "MARKET"
    | "STOP_LOSS"
    | "STOP_LOSS_LIMIT"
    | "TAKE_PROFIT"
    | "TAKE_PROFIT_LIMIT";
export type TimeInForce = "GTC" | "IOC" | "FOK";
export type OrderResponseType = "ACK" | "RESULT" | "FULL";
export type SelfTradePreventionMode =
    | "NONE"
    | "EXPIRE_TAKER"
    | "EXPIRE_MAKER"
    | "EXPIRE_BOTH"; // 根據實際 STP 支援擴充