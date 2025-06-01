import { transformTickerData } from "@/utils";
import { transformKlineFromWs, transformVolumFromWs } from "./utils";

const sockets: Record<string, WebSocket> = {};

const postMessage = ({ type, data, url }: any) => {
  self.postMessage({
    type,
    data,
    url,
  });
};

self.onmessage = async (e) => {
  const { type, url } = e.data;

  if (sockets[type]) {
    sockets[type].close();
  }

  // await new Promise((res) => setTimeout(res, 100)); // 👈 留一點時間讓 TCP/WS 結束

  const ws = new WebSocket(url);
  sockets[type] = ws;

  sockets[type].onopen = () => {
    // console.log("ws已連線");
  };

  sockets[type].onmessage = (event) => {
    let data = JSON.parse(event.data);

    switch (type) {
      case "ticker":
        data = transformTickerData(data);
        break;
      case "kline":
        data = {
          kline: transformKlineFromWs(data),
          bar: transformVolumFromWs(data),
        };
        break;
      default:
        break;
    }
    postMessage({
      type,
      data,
      url,
    });
  };
};
