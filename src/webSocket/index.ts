import { WorkerRequest, WsType } from "@/types";

type WsMiddleware<T = any> = (data: T) => T;

interface IWsConfig {
  retry?: number;
}

class WebSocketIn {
  private ws: WebSocket | null = null;

  private wsConfig: IWsConfig = {};

  public wsData: any;

  public wsType: WsType;

  private heartbeatTimer: any;

  private lastTime: number = 0;

  private isManualClose: boolean = false;

  private requestURL: string;

  private middleware?: WsMiddleware[];

  private postMessage: (param: WorkerRequest) => void;

  private wsParam: any;

  static socketMap: Map<string, WebSocketIn> = new Map();

  constructor({
    url,
    type,
    postMessage,
    middleware,
    config,
    param,
  }: {
    url: string;
    type: WsType;
    postMessage: (param: WorkerRequest) => void;
    middleware?: WsMiddleware[];
    config?: IWsConfig;
    param: any;
  }) {
    WebSocketIn.socketMap.set(type, this);
    this.wsType = type;
    this.setupWebSocket();
    this.wsConfig = config || {};
    this.requestURL = url;
    this.middleware = middleware;
    this.postMessage = postMessage;
    this.wsParam = param;
  }

  setupWebSocket() {
    this.ws = new WebSocket("wss://stream.binance.com:9443/stream");

    this.ws.onopen = () => {
      this.lastTime = Date.now();
      this.startHeartbeatCheck();
      console.log(`${this.wsType}已連線`);

      this.ws?.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: this.wsParam,
          id: Date.now(),
        })
      );
    };

    this.ws.onmessage = (event) => {
      this.lastTime = Date.now();
      let wsData = JSON.parse(event.data);

      if (wsData.result === null && typeof wsData.id === "number") {
        // console.log(`[WS] 操作成功：id=${wsData.id}`);
        return; // 不處理這類非資料型的回應
      }

      if (this.middleware?.length) {
        wsData = this.middleware.reduce((acc, fn) => fn(acc), wsData);
      }

      this.postMessage({
        type: this.wsType,
        data: wsData,
        url: this.requestURL,
      });
    };

    this.ws.onerror = (error) => {
      console.log(`${this.wsType}出現錯誤`);
    };

    this.ws.onclose = () => {
      if (this.isManualClose) return;
      console.log(`${this.wsType}即將重新連線`, this.isManualClose);
      this.reconnect();
    };
  }

  getWsState() {
    return this.ws?.readyState;
  }

  getPrevParam() {
    return this.wsParam;
  }

  public sendMessage(data: string) {
    this.wsParam = JSON.parse(data).params;
    // console.log("this.wsParam", this.wsParam);

    this.ws?.send(data);
  }

  reconnect() {
    if (this.wsConfig.retry) {
      this.wsConfig.retry -= 1;
      const delay = 3000;
      console.log(`${this.wsType}已重試`);
      setTimeout(() => {
        this.setupWebSocket();
      }, delay);
    } else {
      console.log(`${this.wsType}已無法再次重試`);
    }
  }

  public mannelClose() {
    this.isManualClose = true;
    this.close();
  }

  close() {
    // 取消訂閱
    this.sendMessage(
      JSON.stringify({
        method: "UNSUBSCRIBE",
        params: this.wsParam,
        id: Date.now(),
      })
    );
    this.ws?.close();
    WebSocketIn.socketMap.delete(this.wsType);
    clearInterval(this.heartbeatTimer);
    // console.log(`${this.wsType} 已關閉`);
  }

  startHeartbeatCheck() {
    this.heartbeatTimer = setInterval(() => {
      const currTime = Date.now();
      if (currTime - this.lastTime > 5000) {
        console.log(`心跳停止 ${this.wsType} 結束連線`);
        this.close();
      }
    }, 30 * 1000);
  }
}

export default WebSocketIn;
