import { IBarData, IKlineData, IMaData, KlineTuple } from "./types";
import dayjs from "dayjs";
import {
  AreaSeriesPartialOptions,
  BarSeriesPartialOptions,
  CandlestickSeries,
  CandlestickSeriesPartialOptions,
  ChartOptions,
  ColorType,
  createChart,
  DeepPartial,
  HistogramSeries,
  HistogramSeriesPartialOptions,
  LineSeriesPartialOptions,
  OhlcData,
  SeriesPartialOptionsMap,
  UTCTimestamp,
} from "lightweight-charts";

export function transformKlineData(data: KlineTuple[]): IKlineData[] {
  return data.map((item, index) => {
    const d = dayjs(item[0]); // item[0] 是 timestamp (ms)
    return {
      time: Math.floor(item[0] / 1000) as UTCTimestamp, // 轉換成秒為單位、、
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    };
  });
}

export function transformBarData(data: KlineTuple[]): IBarData[] {
  return data.map((item, index) => {
    return {
      time: Math.floor(item[0] / 1000) as UTCTimestamp, // 轉換成秒為單位、、
      value: parseFloat(item[5]),
      color: parseFloat(item[4]) >= parseFloat(item[1]) ? "#26a69a" : "#ef5350", // or custom logic
      quoteVolume: parseFloat(item[5]),
    };
  });
}

export function generateChart(
  container: HTMLElement,
  customOptions?: DeepPartial<ChartOptions>
) {
  // 預設選項
  const defaultOptions: DeepPartial<ChartOptions> = {
    autoSize: true,
    layout: {
      background: {
        type: ColorType.Solid,
        color: "white",
      },
    },
    crosshair: {
      mode: 0,
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.3,
        bottom: 0.25,
      },
      borderVisible: false,
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...customOptions,
  };
  return createChart(container, mergedOptions);
}

export function calculateMA(KlineData: IKlineData[], lineData: OhlcData, period: number): number {
  const { time } = lineData;
  const hoveredIndex = KlineData.findIndex(d => d.time === time);
  const startIndex = hoveredIndex - period + 1;
  const endIndex = hoveredIndex + 1; // slice 需要+1
  const range = KlineData.slice(startIndex, endIndex);
  const sum = range.reduce((acc, curr) => acc + curr.close, 0);
  const ma = sum / period;
  return ma;
}

export function getMaData(KlineData: IKlineData[], lineData: OhlcData): IMaData {
  const ma7 = calculateMA(KlineData, lineData, 7);
  const ma25 = calculateMA(KlineData, lineData, 25);
  const ma99 = calculateMA(KlineData, lineData, 99);

  const { time } = lineData;
  //  console.log('lineData',lineData,'time',time);
  return {
    ma7,
    ma25,
    ma99,
  }
}
