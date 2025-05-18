import { IKlineData, KlineTuple } from "./types";
import dayjs from "dayjs";
import {
    CandlestickSeries,
    ChartOptions,
    ColorType,
    createChart,
    DeepPartial,
    UTCTimestamp,
} from "lightweight-charts";

export function transformKlineData(data: KlineTuple[]): IKlineData[] {
    return data
        .map((item, index) => {
            const d = dayjs(item[0]); // item[0] 是 timestamp (ms)
            return {
                time: Math.floor(item[0] / 1000) as UTCTimestamp, // 轉換成秒為單位、、
                // time: {
                //     year: d.year(),
                //     month: d.month() + 1, // ✅ 注意：dayjs 的 month 從 0 開始
                //     day: d.date(),
                // },
                // value: parseFloat(item[1]),
                open: parseFloat(item[1]),
                high: parseFloat(item[2]),
                low: parseFloat(item[3]),
                close: parseFloat(item[4]),
            };
        })
    // .filter(({ high, low }) => {
    //   const maxReasonable = 1.2 * 110000; // 依你幣種與當前行情設上下限
    //   const minReasonable = 0.8 * 100000;
    //   return high < maxReasonable && low > minReasonable;
    // });
}

export function generateKlineChart(container: HTMLElement) {
    const chartOptions: DeepPartial<ChartOptions> = {
        autoSize: true, //可添加ResizeObserver
        layout: {
            background: {
                type: ColorType.Solid,
                color: "white",
            },
        },
        // timeScale: {
        //   barSpacing: 9,
        //      minBarSpacing: 9,  
        // },
    };
    const chart = createChart(container, chartOptions);
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
    });

    return { candlestickSeries, chart }
}