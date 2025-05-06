import { http, proxyHttp } from "@/api";
import {
  DepthResponse,
  ExchangeInfoResponse,
  SymbolInfoListTypes,
  KlineParam,
  Ticker24hrStat,
  OrderRequest,
} from "@/types";
import { getSignature } from "@/utils";

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
    meta: {
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
export async function getKlinesData(params: KlineParam) {
  const { symbol, interval } = params;
  const data = await http.get({
    url: `klines?symbol=${symbol}&interval=${interval}`,
  });
  return data;
}

export const getDepthData = async (params: any): Promise<DepthResponse> => {
  const { symbol } = params;
  const res = await http.get({
    url: `depth?symbol=${symbol}`,
  });
  return res.data;
};

export const createOrder = async (body: OrderRequest) => {
  const { query, signature } = getSignature(body); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;

  const data = await proxyHttp.post({
    url: `order?${finalQuery}`,
  });

  return data;
};

export const getCurrentOrder = async () => {
  const { query, signature } = getSignature({
    timestamp: Date.now(),
  }); // ✅ 產生簽名
  const finalQuery = `${query}&signature=${signature}`;
  const res = await proxyHttp.get({
    url: `openOrders?${finalQuery}`,
  });
  console.log("getCurrentOrder", res);
  return res.data;
};
