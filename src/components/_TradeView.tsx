import { useEffect, useRef, useState } from "react";
import { useKlineData, useKlineChart } from "@/hook/TradeView";
import { IKlineData } from "@/hook/TradeView/types";
import { OhlcData } from "lightweight-charts";
import dayjs from "dayjs";
import { formatNumToFixed } from "@/utils";

export default function TradeView() {
  const chartContainerRef = useRef<HTMLDivElement>(null); // 這裡取得 DOM

  const { KlineData, WsKlineData, barData, WsBarData } = useKlineData();
  const { lineSeries, barSeries } = useKlineChart(
    chartContainerRef?.current,
    WsKlineData
  );

  useEffect(() => {
    if (KlineData.length) {
      lineSeries?.setData(KlineData);
    }
  }, [KlineData, lineSeries]);

  useEffect(() => {
    if (barData.length) {
      barSeries?.setData(barData);
    }
  }, [barData, barSeries]);

  useEffect(() => {
    if (WsKlineData.time) {
      lineSeries?.update(WsKlineData);
    }
  }, [WsKlineData, lineSeries]);

  useEffect(() => {
    if (WsBarData.time) {
      barSeries?.update(WsBarData);
    }
  }, [WsBarData, barSeries]);

  return (
    <div className="w-full h-full relative" ref={chartContainerRef}>
      <div className=""></div>
    </div>
  );
}

export function Lengend(data: OhlcData) {
  const lengendData = [
    {
      label: "開盤價",
      value: data.open,
    },
    {
      label: "最高價",
      value: data.high,
    },
    {
      label: "最低價",
      value: data.low,
    },
    {
      label: "收盤價",
      value: data.close,
    },
  ];

  return (
    <div className="absolute top-5px left-10px w-full z-10 flex gap-5px text-14px  font-mono">
      <div className="">
        <p>{dayjs(new Date()).format("YYYY/MM/DD")}</p>
      </div>
      {lengendData.map((item, index) => {
        return (
          <div className="flex ga-3px" key={index}>
            <p>{item.label}: </p>
            <p className="text-rise  min-w-[80px]">
              {formatNumToFixed(item.value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
