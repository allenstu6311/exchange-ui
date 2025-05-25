import { IBarData, IKlineData, KlineTuple } from "./types";
import dayjs from "dayjs";
import {
  CandlestickSeries,
  ChartOptions,
  ColorType,
  createChart,
  DeepPartial,
  HistogramSeries,
  SeriesPartialOptionsMap,
  UTCTimestamp,
} from "lightweight-charts";

export function transformKlineData(data: KlineTuple[]): IKlineData[] {
  return data.map((item, index) => {
    const d = dayjs(item[0]); // item[0] 是 timestamp (ms)
    return {
      time: Math.floor(item[0] / 1000) as UTCTimestamp, // 轉換成秒為單位、、
      // time: {
      //     year: d.year(),
      //     month: d.month() + 1, // ✅ 注意：dayjs 的 month 從 0 開始
      //     day: d.date(),
      // },
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    };
  });
  // .filter(({ high, low }) => {
  //   const minReasonable = 0.8 * 100000;
  //   return high < maxReasonable && low > minReasonable;
  // });
}

export function transformBarData(data: KlineTuple[]): IBarData[] {
  return data.map((item, index) => {
    return {
      time: Math.floor(item[0] / 1000) as UTCTimestamp, // 轉換成秒為單位、、
      value: parseFloat(item[5]),
      color: parseFloat(item[4]) >= parseFloat(item[1]) ? "#26a69a" : "#ef5350", // or custom logic
    };
  });
}

export function generateKlineChart(
  container: HTMLElement,
  candlestickOptions?: SeriesPartialOptionsMap["Candlestick"]
) {
  const chartOptions: DeepPartial<ChartOptions> = {
    autoSize: true, //可添加ResizeObserver
    layout: {
      background: {
        type: ColorType.Solid,
        color: "white",
      },
    },
    crosshair: {
      mode: 0, // 十字準線模式對焦滑鼠
    },
    rightPriceScale: {
      scaleMargins: {
        top: 0.3, // leave some space for the legend
        bottom: 0.25,
      },
      borderVisible: false,
    },
  };
  const chart = createChart(container, chartOptions);

  const candlestickSeries = chart.addSeries(CandlestickSeries, {
    upColor: "#26a69a",
    downColor: "#ef5350",
    borderVisible: false,
    wickUpColor: "#26a69a",
    wickDownColor: "#ef5350",
    ...candlestickOptions,
  });

  const volumeSeries = chart.addSeries(HistogramSeries, {
    priceFormat: {
      type: "volume",
    },
    priceScaleId: "", // set as an overlay by setting a blank priceScaleId
  });

  volumeSeries.priceScale().applyOptions({
    scaleMargins: {
      top: 0.9, // highest point of the series will be 70% away from the top
      bottom: 0,
    },
  });
  // chart.timeScale().fitContent();

  return { candlestickSeries, volumeSeries, chart };
}
