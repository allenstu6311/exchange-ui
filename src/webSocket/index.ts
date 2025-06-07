import { WorkerRequest, WsType } from "@/types";

type WsMiddleware = (data: any) => any;

interface IWsConfig {
    retry?: number
}


class WebSocketIn {
    private ws: WebSocket;

    private wsConifg: IWsConfig = {};

    public wsData: any;

    public wsType: string = ''

    private heartbeatTimer: any;

    private lastTime: number = 0;

    private isMannelClose: boolean = false;

    private reConnectFn: () => void

    static socketMap: Map<string, WebSocketIn> = new Map()

    constructor({
        url,
        type,
        postMessage,
        middleware,
        config,
        onReconnect
    }: {
        url: string,
        type: WsType,
        postMessage: (param: WorkerRequest) => void,
        middleware?: WsMiddleware[],
        config?: IWsConfig,
        onReconnect: () => void
    }) {

        this.ws = new WebSocket(url);
        WebSocketIn.socketMap.set(type, this);
        this.wsType = type;
        this.reConnectFn = onReconnect;
        this.wsConifg = config || {};

        this.ws.onopen = () => {
            this.lastTime = Date.now();
            this.startHeartbeatCheck();
            console.log(`${type}已連線`);
        }

        this.ws.onmessage = (event) => {
            this.lastTime = Date.now()
            let data = JSON.parse(event.data);

            if (middleware?.length) {
                data = middleware.reduce((acc, fn) => fn(acc), data);
            }
            postMessage({
                type,
                data,
                url,
            });
        }

        this.ws.onerror = () => {
            console.log(`${type}出現錯誤`);
        }

        this.ws.onclose = () => {
            if (this.isMannelClose) return;
            console.log(`${type}即將重新連線`);
            this.reconnect()
        }
    }

    getReadyState() {
        return this.ws.readyState;
    }

    reconnect() {
        if (this.wsConifg.retry) {
            this.wsConifg.retry -= 1;
            const delay = (4 - this.wsConifg.retry) * 1000;
            console.log(`${this.wsType}已重試`);
            setTimeout(() => {
                this.reConnectFn()
            }, delay)
        } else {
            console.log('已無法再次重試');
        }
    }

    public mannelClose() {
        this.isMannelClose = true;
        this.close()
    }

    close() {
        this.ws.close();
        WebSocketIn.socketMap.delete(this.wsType);
        clearInterval(this.heartbeatTimer);
        console.log(`${this.wsType} 已關閉`);
    }

    startHeartbeatCheck() {
        this.heartbeatTimer = setInterval(() => {
            const currTime = Date.now();
            if (currTime - this.lastTime > 5000) {
                console.log(`心跳停止 ${this.wsType} 結束連線`);
                this.close();
                this.reconnect()
            }
        }, 5000)
    }
}

export default WebSocketIn