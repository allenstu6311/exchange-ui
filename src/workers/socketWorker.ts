import {
  getMiddlewares,
  createUnsubscribeMessage,
  createSubscribeMessage,
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

// 獨立的創建連接函數
function createNewConnection({
  type,
  param,
  postMessage,
}: {
  type: WsType;
  param: any;
  postMessage: (param: WorkerRequest) => void;
}) {
  console.log(`🚀 創建 ${type} 新連接`);
  const middleware = getMiddlewares(type);
  new WebSocketIn({
    type,
    postMessage,
    middleware,
    config: {
      retry: 3,
    },
    param,
  });
}

self.onmessage = async (e) => {
  const { type, url, param }: { type: WsType; url: string; param: any } =
    e.data;  
  const ws = WebSocketIn.socketMap.get(type);

  // 如果已經有實體只修改參數
  if (ws) {
    const wsState = ws.getWsState();
    const isUnhealthy = ws.getIsUnhealthy();
    console.log('wsState',wsState);
    switch (wsState) {
      case WebSocket.OPEN: {
        // 連接正常，檢查參數是否需要更新
        const prevParam = ws.getPrevParam();
        const paramChanged = JSON.stringify(prevParam) !== JSON.stringify(param);
        if (paramChanged) {
          console.log(`🔄 ${type} 參數變更，更新訂閱`);
          ws.sendMessage(createUnsubscribeMessage(prevParam));
          ws.sendMessage(createSubscribeMessage(param));
        }
        break;
      }
      case WebSocket.CLOSING: {
        console.log(`🔄 ${type} 連接關閉中`);
        break;
      }
      case WebSocket.CONNECTING: {
        ws.sendNewParam(param);
        break;
      }
      case WebSocket.CLOSED: {
        createNewConnection({
          type,
          param,
          postMessage,
        });
        break;
      }
    }


    if (isUnhealthy) {
      // 不健康的連線(心跳停止等等...)，關閉重啟
      ws.mannelClose();
      createNewConnection({
        type,
        param,
        postMessage,
      });
    }
  } else {
    // 沒有連接，創建新連接
    createNewConnection({
      type,
      param,
      postMessage,
    });
  }
};