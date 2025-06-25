import { transformTickerData } from "@/utils";
import {
  getMiddlewares,
  transformKlineFromWs,
  transformVolumFromWs,
  translfrmKlineData,
} from "./utils";
import { WorkerRequest, WsType } from "@/types";
import WebSocketIn from "@/webSocket";

enum WebSocketStatus {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}

const postMessage = ({ type, data, url }: WorkerRequest) => {
  self.postMessage({
    type,
    data,
    url,
  });
};

self.onmessage = async (e) => {
  const { type, url }: { type: WsType; url: string } = e.data;
  const ws = WebSocketIn.socketMap.get(type);

  if (ws) ws.mannelClose();
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
    });
  };
  connect();
};
