import { http, proxyHttp } from "@/api";
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
} from "@/types";
import { getSignature } from "@/utils";
import { successToast } from "@/utils/notify";

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
      onSuccess() { },
      onError() { },
      retry: 3,
      middleware: [
        (config: any, result: any) => {
          return result;
        },
      ],
    },
  });
};

export async function getKlinesData(params: IKlinesRequest) {
  const data = await http.get({
    //      url: `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000&startTime=1672531200000
    // `,
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
  const { query, signature } = getSignature(body); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;

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
  const { query, signature } = getSignature(body); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;

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
  const { query, signature } = getSignature({
    timestamp: Date.now(),
    symbol,
  });
  const finalQuery = `${query}&signature=${signature}`;
  return proxyHttp.get<ICurrentOrder[]>({
    url: `openOrders?${finalQuery}`,
  });
};

export const getAccountInfo = async () => {
  const { query, signature } = getSignature({
    timestamp: Date.now(),
  });
  const finalQuery = `${query}&signature=${signature}`;
  return proxyHttp.get<IAccountInfo>({
    url: `account?${finalQuery}`,
  });
};

export const getHistoricalTrades = async ()=>{
    const { query, signature } = getSignature({
    timestamp: Date.now(),
  });
  const finalQuery = `${query}&signature=${signature}`;
  return proxyHttp.get<any>({
    url:`historicalTrades${finalQuery}`
  })
}
