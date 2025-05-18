import { useEffect, useRef, useState } from "react";
import { useKlineData, useKlineChart } from "@/hook/TradeView";

export default function TradeView() {
  const chartContainerRef = useRef<HTMLDivElement>(null); // 這裡取得 DOM

  const { KlineData, WsKlineData } = useKlineData();
  const { series } = useKlineChart(chartContainerRef?.current);

  useEffect(() => {
    if (KlineData.length) {
      series?.setData(KlineData);
    }
  }, [KlineData, series]);

  useEffect(() => {
    if (WsKlineData.time) {
      series?.update(WsKlineData);
    }
  }, [WsKlineData, series]);

  return (
    <div className="w-full h-full" ref={chartContainerRef}>
      <div className=""></div>
    </div>
  );
}
