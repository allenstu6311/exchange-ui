import { WorkerRequest, WsType } from "@/types";
import { createSubscribeMessage, createUnsubscribeMessage } from "@/workers/utils";

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

  private isUnhealthy: boolean = false;

  private retryCount: number = 0;

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
    // this.closeExistingConnection(type);
    this.wsType = type;
    this.wsConfig = config || {};
    const { retry } = this.wsConfig;
    this.retryCount = retry || 0;

    this.requestURL = url;
    this.middleware = middleware;
    this.postMessage = postMessage;
    this.wsParam = param;
    WebSocketIn.socketMap.set(this.wsType, this);
    this.setupWebSocket();
  }
  getWsState() {
    return this.ws?.readyState;
  }

  getPrevParam() {
    return this.wsParam;
  }

  public getIsUnhealthy() {
    return this.isUnhealthy;
  }

  // private closeExistingConnection(type: WsType) {
  //   const existingConnection = WebSocketIn.socketMap.get(type);
  //   if (existingConnection) {
  //     console.log(`⚠️ 發現 ${type} 已有連接，立即關閉舊連接`);
  //     existingConnection.mannelClose();
  //     setTimeout(() => {
  //       console.log(`✅ ${type} 舊連接已清理完成`);
  //     }, 100);
  //   }
  // }

  reset() {
    const { retry } = this.wsConfig;
    this.isUnhealthy = false;
    this.retryCount = retry || 0;
  }

  setupWebSocket() {
    if (this.isManualClose) return;
    this.ws = new WebSocket("wss://stream.binance.com:9443/stream");

    this.ws.onopen = () => {
      this.lastTime = Date.now();
      if (!this.heartbeatTimer) {
        this.startHeartbeatCheck();
      }
      console.log(`✅ ${this.wsType} 已連線`);
      this.ws?.send(createSubscribeMessage(this.wsParam));

    };

    this.ws.onmessage = (event) => {
      // console.log("onmessage",WebSocketIn.socketMap);
      this.lastTime = Date.now();
      let wsData = JSON.parse(event.data);

      if (wsData.result === null && typeof wsData.id === "number") {
        return;
      }

      if (this.middleware?.length) {
        wsData = this.middleware.reduce((acc, fn) => fn(acc), wsData);
      }

      this.postMessage({
        type: this.wsType,
        data: wsData,
        url: this.requestURL,
      });

      this.reset();
    };

    this.ws.onerror = (error) => {
      console.log(`❌ ${this.wsType} 出現錯誤`);
      this.reconnect()
    };

    this.ws.onclose = () => {
      if (this.isManualClose) return;
      console.log(`🔄 ${this.wsType} 即將重新連線`);
      this.reconnect();
    };
  }

  public sendMessage(data: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn(`⚠️ ${this.wsType} 連接未就緒，無法發送消息`);
      return;
    }
    this.wsParam = JSON.parse(data).params;
    this.ws?.send(data);
  }

  reconnect() {
    if (this.retryCount && this.retryCount > 0) {
      this.retryCount -= 1;
      const delay = 3000;
      console.log(`🔄 ${this.wsType} 重試中，剩餘次數: ${this.retryCount}`);
      setTimeout(() => {
        this.setupWebSocket();
      }, delay);
    } else {
      console.log(`❌ ${this.wsType} 重試次數已用完`);
      this.cleanup();
    }
  }

  public mannelClose() {
    this.isManualClose = true;
    WebSocketIn.socketMap.delete(this.wsType);
    this.close();
  }

  close() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws?.send(createUnsubscribeMessage(this.wsParam));
    }
    this.cleanup();
    this.ws?.close();

  }

  cleanup() {
    // WebSocketIn.socketMap.delete(this.wsType);
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  startHeartbeatCheck() {
    this.heartbeatTimer = setInterval(() => {
      const currTime = Date.now();
      if (currTime - this.lastTime > 5000) {
        console.log(`💔 心跳停止 ${this.wsType} 結束連線`);
        this.isUnhealthy = true;
        this.close();
      }
    }, 30 * 1000);
  }

  isConnectionHealthy(): boolean {
    return this.ws !== null &&
      this.ws.readyState === WebSocket.OPEN &&
      !this.isManualClose;
  }
}

export default WebSocketIn;
