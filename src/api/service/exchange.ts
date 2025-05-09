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
} from "@/types";
import { getSignature } from "@/utils";
import { successToast } from "@/utils/notify";

export const getSymbolMetaMap = async (): Promise<ExchangeInfoResponse> => {
  const res = await http.get({
    url: "/exchangeInfo",
  });
  return res.data;
};

export const getTickerBy24hr = async (): Promise<Ticker24hrStat[]> => {
  const res = await http.get({
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
  return res.data;
};

// 暫時停用
// export async function getKlinesData(params: KlineParam) {
//   const { symbol, interval } = params;
//   const data = await http.get({
//     url: `klines?symbol=${symbol}&interval=${interval}`,
//   });
//   return data;
// }

export const getDepthData = async (params: any): Promise<DepthResponse> => {
  const { symbol } = params;
  const res = await http.get({
    url: `depth?symbol=${symbol}`,
  });
  return res.data;
};

export const createOrder = async (
  body: OrderRequest
): Promise<OrderRequest> => {
  const { query, signature } = getSignature(body); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;

  const res = await proxyHttp.post({
    url: `order?${finalQuery}`,
    metas: {
      onSuccess() {
        successToast("成功", "訂單已成功建立！");
      },
    },
  });
  return res.data;
};

export const getCurrentOrder = async (
  params: ICurrentOrderRequest
): Promise<ICurrentOrder[]> => {
  const { symbol } = params;
  const { query, signature } = getSignature({
    timestamp: Date.now(),
    symbol,
  }); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;
  const res = await proxyHttp.get({
    url: `openOrders?${finalQuery}`,
  });
  return res.data;
};

export const getAccountInfo = async (): Promise<IAccountInfo> => {
  const { query, signature } = getSignature({
    timestamp: Date.now(),
  }); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;
  const res = await proxyHttp.get({
    url: `account?${finalQuery}`,
  });
  return res.data;
};
