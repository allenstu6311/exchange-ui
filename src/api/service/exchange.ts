import { http, proxyHttp } from "@/api";
import {
  DepthResponse,
  ExchangeInfoResponse,
  SymbolInfoListTypes,
  KlineParam,
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
      onSuccess() {},
      onError() {},
      retry: 3,
      middleware: [
        (config: any, result: any) => {
          return result;
        },
      ],
    },
  });
};

// 暫時停用
// export async function getKlinesData(params: KlineParam) {
//   const { symbol, interval } = params;
//   const data = await http.get({
//     url: `klines?symbol=${symbol}&interval=${interval}`,
//   });
//   return data;
// }

export const getDepthData = async (params: any) => {
  const { symbol } = params;
  const res = await http.get<DepthResponse>({
    url: `depth?symbol=${symbol}`,
  });
  return res;
};

export const createOrder = async (body: OrderRequest) => {
  const { query, signature } = getSignature(body); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;

  const res = await proxyHttp.post<OrderRequest>({
    url: `order?${finalQuery}`,
    metas: {
      onSuccess() {
        successToast("成功", "訂單已成功建立！");
      },
    },
  });
  return res;
};

export const cancleOrder = async (body: ICancelOrderRequest) => {
  const { query, signature } = getSignature(body); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;

  const res = await proxyHttp.delete<ICancelOrderRequest>({
    url: `order?${finalQuery}`,
    metas: {
      onSuccess() {
        successToast("成功", "訂單已取消！");
      },
    },
  });
  return res;
};

export const getCurrentOrder = async (params: ICurrentOrderRequest) => {
  const { symbol } = params;
  const { query, signature } = getSignature({
    timestamp: Date.now(),
    symbol,
  }); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;
  const res = await proxyHttp.get<ICurrentOrder[]>({
    url: `openOrders?${finalQuery}`,
  });
  return res;
};

export const getAccountInfo = async () => {
  const { query, signature } = getSignature({
    timestamp: Date.now(),
  }); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;
  const res = await proxyHttp.get<IAccountInfo>({
    url: `account?${finalQuery}`,
  });
  return res;
};
