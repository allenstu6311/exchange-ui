import http from "@/api";
import { DepthResponse, KlineParam, Ticker24hrStat } from "@/types";

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

export const getDepthData = async (): Promise<DepthResponse> => {
  const res = await http.get({
    url: `depth?symbol=BTCUSDT`,
  });
  return res.data;
};
