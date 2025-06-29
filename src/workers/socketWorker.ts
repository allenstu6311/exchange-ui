import { transformTickerData } from "@/utils";
import {
  getMiddlewares,
  transformKlineFromWs,
  transformVolumFromWs,
  translfrmKlineData,
} from "./utils";
import { WorkerRequest, WsType } from "@/types";
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
    ws.sendMessage(
      JSON.stringify({
        method: "UNSUBSCRIBE",
        params: prevParam,
        id: Date.now(),
      })
    );

    // 重新訂閱
    ws.sendMessage(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: param,
        id: Date.now(),
      })
    );
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
