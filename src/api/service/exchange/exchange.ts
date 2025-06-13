import { http, IAPIResponse, ICustomRequestConfig, proxyHttp } from "@/api";
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
} from "@/types";
import {
  getSafeTimestamp,
  getSignature,
  handleTimestampDriftRetry,
  withRetry,
} from "@/api/utils";
import { successToast } from "@/utils/notify";
import { Axios, AxiosResponse } from "axios";

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
  });
};

export const createOrder = async (body: OrderRequest) => {
  const finalQuery = getSignature(body); // ✅ 產生簽名

  return proxyHttp.post<OrderRequest>({
    url: `order?${finalQuery}`,
    metas: {
      onSuccess() {
        successToast("成功", "訂單已成功建立！");
      },
    },
  });
};

export const cancleOrder = async (body: ICancelOrderRequest) => {
  const finalQuery = getSignature(body); // ✅ 產生簽名

  return proxyHttp.delete<ICancelOrderRequest>({
    url: `order?${finalQuery}`,
    metas: {
      onSuccess() {
        successToast("成功", "訂單已取消！");
      },
    },
  });
};

export const getCurrentOrder = async (params: ICurrentOrderRequest) => {
  const { symbol } = params;
  const sendRequest = async () => {
    const finalQuery = getSignature({
      timestamp: getSafeTimestamp(timeOffset),
      symbol,
    });
    return proxyHttp.get<ICurrentOrder[]>({
      url: `openOrders?${finalQuery}`,
      metas: {
        onError(config, result) {
          return handleTimestampDriftRetry(result, sendRequest);
        },
      },
    });
  };

  return sendRequest();
};

export const getAccountInfo = async () => {
  // const sendRequest = async () => {
  // const finalQuery = getSignature({
  //   timestamp: getSafeTimestamp(timeOffset),
  // });
  //   try {
  // const res = await proxyHttp.get<IAccountInfo>({
  //   url: `account?${finalQuery}`,
  // });
  //     return res;
  //   } catch (error: IAPIResponse<IAccountInfo> | any) {
  //     const { data } = error;
  //     return handleTimestampDriftRetry<IAccountInfo>(data, sendRequest);
  //   }
  // };

  // return sendRequest();

  const request = async () => {
    const finalQuery = getSignature({
      timestamp: getSafeTimestamp(timeOffset),
    });

    return proxyHttp.get<IAccountInfo>({
      url: `account?${finalQuery}`,
    });
  };

  return withRetry<IAccountInfo>(request, (error) => true);
};

export const getHistoricalTrades = async (params: IHistoryOrderRequest) => {
  const { symbol } = params;
  const sendRequest = async () => {
    const finalQuery = getSignature({
      timestamp: getSafeTimestamp(timeOffset),
      symbol,
    });
    return proxyHttp.get<IHistoryOrderData[]>({
      url: `myTrades?${finalQuery}`,
      metas: {
        onError(config, result) {
          return handleTimestampDriftRetry(result, sendRequest);
        },
      },
    });
  };

  return sendRequest();
};

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
