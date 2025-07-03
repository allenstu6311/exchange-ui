import {
  getMiddlewares,
  sendUnsubscribeMessage,
  sendSubscribeMessage,
} from "./utils";
import { WorkerRequest, WsType } from "@/types";
import { delay } from "@/utils";
import WebSocketIn from "@/webSocket";


const postMessage = ({ type, data, url }: WorkerRequest) => {
  self.postMessage({
    type,
    data,
    url,
  });
};

self.onmessage = async (e) => {
  const { type, url, param }: { type: WsType; url: string; param: any } =
    e.data;
  const ws = WebSocketIn.socketMap.get(type);

  if (ws && ws.getWsState() !== WebSocket.CONNECTING) {
    const prevParam = ws.getPrevParam();
    // 取消訂閱
    sendUnsubscribeMessage(ws, prevParam);
    // await delay(1000);
    // 重新訂閱
    sendSubscribeMessage(ws, param);
  } else if (!ws) {
    const connect = () => {
      const middleware = getMiddlewares(type);
      new WebSocketIn({
        url,
        type,
        postMessage,
        middleware,
        config: {
          retry: 3,
        },
        param,
      });
    };
    connect();
  }
};
