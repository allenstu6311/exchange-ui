import { proxyHttp, http } from "@/api";
import { IHistoryOrderData } from "@/hook/OrderList/types";
import { IKlinesRequest } from "@/hook/TradeView/types";
import {
  DepthResponse,
  ExchangeInfoResponse,
  SymbolInfoListTypes,
  Ticker24hrStat,
  OrderRequest,
  ICurrentOrder,
  ICurrentOrderRequest,
  IAccountInfo,
  ICancelOrderRequest,
  IHistoryOrderRequest,
  IRecentTradesResponse
} from "@/types";
import { getSafeTimestamp } from "@/api/utils";
import { successToast } from "@/utils/notify";
import { IRecentTradesRequest } from "./requestTypes";

let timeOffset = 0;

export const getSymbolMetaMap = async () => {
  return http.get<ExchangeInfoResponse>({
    url: "/exchangeInfo",
  });
};

export const getTickerBy24hr = async () => {
  return http.get<Ticker24hrStat[]>({
    url: "/ticker/24hr",
    params: {},
    metas: {
      onSuccess(data) {},
      onError(config, result) {},
      retry: 3,
      middleware: [(config, result) => result],
    },
  });
};

export async function getKlinesData(params: IKlinesRequest) {
  const data = await http.get({
    url: `https://api.binance.com/api/v3/klines`,
    params,
  });
  return data;
}

export const getDepthData = async (params: any) => {
  const { symbol } = params;
  return http.get<DepthResponse>({
    url: `depth?symbol=${symbol}`,
    metas: {
      retry: 3
    }
  });
};

export const createOrder = async (body: OrderRequest) => {
  return proxyHttp.post<OrderRequest>({
    url: "order",
    body,
    metas: {
      onSuccess() {
        successToast("成功", "訂單已成功建立！");
      },
    },
  });
};

export const cancleOrder = async (body: ICancelOrderRequest) => {
  return proxyHttp.delete<ICancelOrderRequest>({
    url: `order`,
    body,
    metas: {
      onSuccess() {
        successToast("成功", "訂單已取消！");
      },
    },
  });
};

export const getCurrentOrder = async (params: ICurrentOrderRequest) => {
  const { symbol } = params;
  return proxyHttp.get<ICurrentOrder[]>({
    url: `openOrders`,
    params: {
      timestamp: getSafeTimestamp(timeOffset),
      symbol,
    },
    metas:{
      retry: 3,
    }
  });
};

export const getAccountInfo = async () => {
  return proxyHttp.get<IAccountInfo>({
    url: `account`,
    params: {
      timestamp: getSafeTimestamp(timeOffset),
    },
  });
};

export const getHistoricalTrades = async (params: IHistoryOrderRequest) => {
  const { symbol } = params;
  return proxyHttp.get<IHistoryOrderData[]>({
    url: `myTrades`,
    params: {
      timestamp: getSafeTimestamp(timeOffset),
      symbol,
    },
  });
};

export const getRecentTrades = async (params: IRecentTradesRequest) => {
  const { symbol, limit = 500 } = params;
  return http.get<IRecentTradesResponse[]>({
    url: `trades`,
    params: {
      symbol,
      limit,
    },
  });
}

export const getServerTime = async () => {
  await http
    .get({
      url: "/time",
    })
    .then((res) => {
      const { serverTime } = res.data;
      timeOffset = Date.now() - serverTime;
    });
};
