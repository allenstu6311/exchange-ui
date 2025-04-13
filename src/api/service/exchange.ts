import http from "@/api";
import { DepthResponse, KlineParam } from "@/types";

export const getTickerBy24hr = async () => {
  const data = await http.get({
    url: "/ticker/24hr",
    params: {},
    meta: {
      onSuccess() {},
      onError() {},
      retry: 3,
      middleware: [
        (config: any, result: any) => {
          console.log("success");
          return result;
        },
      ],
    },
  });
  return data;
};

// 暫時停用
export async function getKlinesData(params:KlineParam){
  const { symbol, interval } = params
  const data = await http.get({
    url:`klines?symbol=${symbol}&interval=${interval}`,
  })
  return data
}


export async function getDepthData(){
  const data = await http.get({
    url:`depth?symbol=BTCUSDT`,
  });
  return data
}
