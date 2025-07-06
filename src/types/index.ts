import { 
  IRecentTradesResponse, 
  ITicker24hrStatResponse,
  IDepthResponse,
  ISymbolInfoListTypes,
  IExchangeInfoResponse,
  ICurrentOrderResponse,
  IBalance,
  ICommissionRates,
  IAccountInfoResponse
} from "@/api/service/exchange/responseTypes";
import { 
  IWsRecentTradesResponse,
  IWsTickerSocketData,
  IKlineWsData,
} from "@/webSocket/responseType";
import { OrderSide } from "@/api/service/exchange/shared/enum";
import { OrderType } from "@/api/service/exchange/shared/types";

import { 
  ICancelOrderRequest, 
  ICurrentOrderRequest, 
  IHistoryOrderRequest,
  IOrderRequest,
  IKlinesRequest
} from "@/api/service/exchange/requestTypes";

export type { 
  IRecentTradesResponse, 
  ITicker24hrStatResponse,
  IDepthResponse,
  IWsTickerSocketData,
  IWsRecentTradesResponse,
  ISymbolInfoListTypes,
  IExchangeInfoResponse,
  IOrderRequest,
  OrderType,
  ICurrentOrderResponse,
  ICancelOrderRequest,
  ICurrentOrderRequest, 
  IHistoryOrderRequest,
  IBalance,
  ICommissionRates,
  IAccountInfoResponse,
  IKlinesRequest,
  IKlineWsData
};

export {
  OrderSide,
}

export type WsType = "depth" | "ticker" | "kline" | "ticker24hr" | "trades";

export type WorkerRequest = {
  type: WsType;
  data?: any;
  url?: string;
  param?: any;
};

export type NumberString = string | number;
