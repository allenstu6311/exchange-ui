import { useEffect, useRef, useState } from "react";
import { ISeriesApi, Time } from "lightweight-charts";
import useKlineData from "@/hook/TradeView";
import { generateKlineChart } from "@/hook/TradeView/utils";

export default function TradeView() {
  const chartContainerRef = useRef<HTMLDivElement>(null); // 這裡取得 DOM

  const { KlineData, WsKlineData } = useKlineData();
  const [KlineChart, setKlineChart] =
    useState<ISeriesApi<"Candlestick", Time>>();

  useEffect(() => {
    if (KlineData.length && chartContainerRef.current) {
      if (KlineChart) {
        if (WsKlineData.time) {
          KlineChart.update(WsKlineData);
        }
      } else {
        const { candlestickSeries } = generateKlineChart(
          chartContainerRef.current as HTMLElement
        );
        candlestickSeries.setData(KlineData);
        setKlineChart(candlestickSeries);
      }
    }
  }, [KlineData, WsKlineData]);

  return (
    <div className="w-full h-full" ref={chartContainerRef}>
      <div className=""></div>
    </div>
  );
}
