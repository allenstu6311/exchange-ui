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

// 獨立的創建連接函數
function createNewConnection({
  type,
  url,
  param,
  postMessage,
}: {
  type: WsType;
  url: string;
  param: any;
  postMessage: (param: WorkerRequest) => void;
}) {
  console.log(`🚀 創建 ${type} 新連接`);
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
}

self.onmessage = async (e) => {
  const { type, url, param }: { type: WsType; url: string; param: any } =
    e.data;
  const ws = WebSocketIn.socketMap.get(type);

  // 簡單的檢查機制：如果狀態不對，立即關閉
  if (ws) {
    const wsState = ws.getWsState();
    
    // 檢查連接狀態是否正常
    if (wsState === WebSocket.OPEN) {
      // 連接正常，檢查參數是否需要更新
      const prevParam = ws.getPrevParam();
      const paramChanged = JSON.stringify(prevParam) !== JSON.stringify(param);
      
      if (paramChanged) {
        console.log(`🔄 ${type} 參數變更，更新訂閱`);
        // sendUnsubscribeMessage(ws, prevParam);
        // await delay(500);
        // console.log("sendSubscribeMessage");
        // sendSubscribeMessage(ws, param);

        ws.sendMessage(
          JSON.stringify({
            method: "UNSUBSCRIBE",
            params: prevParam,
            id: Date.now(),
          })
        );

        ws.sendMessage(
          JSON.stringify({
            method: "SUBSCRIBE",
            params: param,
            id: Date.now(),
          })
        );
      }
    } else {
      // 狀態不對，關閉舊連接
      console.log(`⚠️ ${type} 狀態異常 (${wsState})，關閉舊連接`);
      ws.mannelClose();
      // 不立即創建新連接，讓系統自然處理
      return;
    }
  } else {
    // 沒有連接，創建新連接
    createNewConnection({
      type,
      url,
      param,
      postMessage,
    });
  }
};
