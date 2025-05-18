import { IKlineData } from "@/hook/TradeView/types";
import { Ticker24hrStat, TickerSocketData } from "@/types";
import dayjs from "dayjs";
import { CandlestickData, UTCTimestamp } from "lightweight-charts";

export function transformTickerData(
    raw: TickerSocketData[],
    quote: string = 'USDT'
): Partial<Ticker24hrStat>[] {
    return raw
        .map((item: TickerSocketData) => {
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
            };
        })
        .filter((item) => item.symbol.endsWith(quote));
}

export function transformKlineFromWs(data: any): IKlineData {
    const { k } = data
    const d = dayjs(k.t); // item[0] 是 timestamp (ms)
    return {
        time: Math.floor(k.t / 1000) as UTCTimestamp, // ✅ 轉成秒
        // time: {
        //     year: d.year(),
        //     month: d.month() + 1, // ✅ 注意：dayjs 的 month 從 0 開始
        //     day: d.date(),
        // },
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
    };
}
