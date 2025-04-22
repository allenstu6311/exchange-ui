import { Ticker24hrStat, TickerSocketData } from "@/types";

const sockets: Record<string, WebSocket> = {};

function transformTickerData(
  raw: TickerSocketData[]
): Partial<Ticker24hrStat>[] {
  return raw
    .map((item: TickerSocketData) => {
      return {
        symbol: item.s,
        priceChange: item.p,
        priceChangePercent: item.P,
        lastPrice: item.c,
        bidPrice: item.b,
        askPrice: item.a,
        highPrice: item.h,
        lowPrice: item.l,
        volume: item.v,
        quoteVolume: item.q,
        time: item.E,
      };
    })
    .filter((item) => item.symbol.endsWith("USDT"));
}

const postMessage = ({ type, data, url }: any) => {
  self.postMessage({
    type,
    data,
    url,
  });
};

self.onmessage = (e) => {
  const { type, url } = e.data;

  if (sockets[type]) {
    sockets[type].close();
  }

  const ws = new WebSocket(url);
  sockets[type] = ws;

  sockets[type].onopen = () => {
    // console.log("ws已連線");
  };

  sockets[type].onmessage = (event) => {
    let data = JSON.parse(event.data);
    // console.log("type", type);
    // console.log("data", data);

    if (type === "ticker") {
      data = transformTickerData(data);
    }

    // if (type === "depth") {}

    postMessage({
      type,
      data,
      url,
    });
  };
};
