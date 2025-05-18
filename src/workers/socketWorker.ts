import { transformTickerData } from "@/utils";
import { transformKlineFromWs } from "./utils";

const sockets: Record<string, WebSocket> = {};


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

    switch(type){
      case 'ticker': data = transformTickerData(data); break;
      case 'kline' : data = transformKlineFromWs(data); break;
      default : break;
    }
    postMessage({
      type,
      data,
      url,
    });
  };
};
