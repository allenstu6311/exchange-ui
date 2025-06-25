import { WorkerRequest, WsType } from "@/types";

type WsMiddleware = (data: any) => any;

interface IWsConfig {
  retry?: number;
}

class WebSocketIn {
  private ws: WebSocket | null = null;

  private wsConifg: IWsConfig = {};

  public wsData: any;

  public wsType: WsType;

  private heartbeatTimer: any;

  private lastTime: number = 0;

  private isMannelClose: boolean = false;

  private requestURL: string;

  private middleware?: WsMiddleware[];

  private postMessage: (param: WorkerRequest) => void;

  static socketMap: Map<string, WebSocketIn> = new Map();

  constructor({
    url,
    type,
    postMessage,
    middleware,
    config,
  }: {
    url: string;
    type: WsType;
    postMessage: (param: WorkerRequest) => void;
    middleware?: WsMiddleware[];
    config?: IWsConfig;
  }) {
    WebSocketIn.socketMap.set(type, this);
    this.wsType = type;
    this.setupWebSocket(url);
    this.wsConifg = config || {};
    this.requestURL = url;
    this.middleware = middleware;
    this.postMessage = postMessage;
  }

  setupWebSocket(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      this.lastTime = Date.now();
      this.startHeartbeatCheck();
      console.log(`${this.wsType}已連線`);
    };

    this.ws.onmessage = (event) => {
      this.lastTime = Date.now();
      let data = JSON.parse(event.data);

      if (this.middleware?.length) {
        data = this.middleware.reduce((acc, fn) => fn(acc), data);
      }
      this.postMessage({
        type: this.wsType,
        data,
        url,
      });
    };

    this.ws.onerror = (error) => {
      // console.log(`${type}出現錯誤`);
    };

    this.ws.onclose = () => {
      if (this.isMannelClose) return;
      console.log(`${this.wsType}即將重新連線`, this.isMannelClose);
      this.reconnect();
    };
  }

  reconnect() {
    if (this.wsConifg.retry) {
      this.wsConifg.retry -= 1;
      const delay = (4 - this.wsConifg.retry) * 1000;
      console.log(`${this.wsType}已重試`);
      setTimeout(() => {
        this.setupWebSocket(this.requestURL);
      }, delay);
    } else {
      console.log("已無法再次重試");
    }
  }

  public mannelClose() {
    this.isMannelClose = true;
    this.close();
  }

  close() {
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
