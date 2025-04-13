const sockets: Record<string, WebSocket> = {};

function transformTickerData(raw: any) {
  return raw.map((item) => {
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
  });
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

  if (sockets[url]) return;

  const ws = new WebSocket(url);
  sockets[url] = ws;

  sockets[url].onopen = () => {
    // console.log('ws已連線');
  };

  sockets[url].onmessage = (event) => {
    let data = JSON.parse(event.data);
    // console.log("type", type);
    // console.log("data", data);

    if (type === "ticker") {
      data = transformTickerData(data);
    }

    if (type === "depth") {
    }

    postMessage({
      type,
      data,
      url,
    });
  };
};
