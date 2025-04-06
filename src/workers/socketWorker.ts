const sockets: Record<string, WebSocket> = {}

function transformTickerData(raw: any) {
    return raw.map((item => {
        return {
            symbol: item.s,
            priceChange: item.p,
            priceChangePercent: item.P,
            lastPrice: item.c,
            bidPrice: item.b,
            askPrice: item.a,
            highPrice: item.h,
            lowPrice: item.l,
            volume: item.v,
            quoteVolume: item.q,
            time: item.E,
        }
    }))
}

const postMessage = ({type, data, url}:any) => {
    self.postMessage({
        type,
        data,
        url,
    })
}

self.onmessage = (e) => {
    console.log('e', e);
    const { type, url } = e.data;

    if (sockets[url]) return;

    const ws = new WebSocket(url);
    sockets[url] = ws;

    ws.onopen = () => {
        console.log('ws已連線');

    }

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const tickerData = transformTickerData(data)
        postMessage({
            type,
            data:tickerData,
            url,
        })
    }

}




