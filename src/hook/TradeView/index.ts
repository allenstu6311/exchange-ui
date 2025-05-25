import { log } from "node:console";
import { klineTimelyData } from "./../../store/kline";
import { getKlinesData } from "@/api/service/exchange/exchange";
import { AppDispatch, RootState, setKlineTimelyData } from "@/store";
import { IBarData, IKlineData } from "./types";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateKlineChart,
  transformBarData,
  transformKlineData,
} from "./utils";
import worker from "@/workers";
import {
  BarData,
  IChartApi,
  ISeriesApi,
  OhlcData,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
// import { Lengend } from "@/components/_TradeView";
import { createRoot } from "react-dom/client";
import { ISymbolInfoWithPrecision } from "../Market/types";

export function useKlineData(
  setLegendsData: React.Dispatch<React.SetStateAction<OhlcData<Time> | undefined>>
) {
  const [KlineData, setKlineData] = useState<IKlineData[]>([]);
  const [WsKlineData, setWsKlineData] = useState<IKlineData | null>();
  const [barData, setBarData] = useState<IBarData[]>([]);
  const [WsBarData, setWsBarData] = useState<IBarData>({
    time: 0 as UTCTimestamp,
    value: 0,
    color: "",
  });

  const uppercaseSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.uppercaseSymbol;
  });

  const lowercaseSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.lowercaseSymbol;
  });
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const getKlinesDataIn = async () => {
      const res = await getKlinesData({
        symbol: uppercaseSymbol,
        interval: "1d",
        limit: 1000,
        startTime: 1672531200000,
      });
      if (res.success) {
        const klineData = transformKlineData(res.data);
        const barData = transformBarData(res.data);
        
        setKlineData(klineData);
        setLegendsData(klineData[klineData.length-1])
        setBarData(barData);
      }

      worker.postMessage({
        type: "kline",
        url: `wss://stream.binance.com:9443/ws/${lowercaseSymbol}@kline_1d`,
      });

      return res.success ? transformKlineData(res.data) : [];
    };

    const handleWsKlineData = (response: MessageEvent) => {
      const { type, data } = response.data;
      if (type !== "kline") return;
      const { kline, bar } = data;
      setWsKlineData(kline);
      setWsBarData(bar);
      dispatch(setKlineTimelyData({ ...kline }));
    };
    setWsKlineData(null)
    getKlinesDataIn();
    worker.subscribe(handleWsKlineData);
    return () => worker.destroy(handleWsKlineData);
  }, [uppercaseSymbol, lowercaseSymbol, dispatch]);

  return { KlineData, WsKlineData, barData, WsBarData };
}

export function useKlineChart(
  container: HTMLElement | null,
  setLegendsData: React.Dispatch<React.SetStateAction<OhlcData<Time> | undefined>>,
  resetLegendsData: ()=>void
) {
  const chartRef = useRef<IChartApi>(null);
  const [lineSeries, setLineSeries] =
    useState<ISeriesApi<"Candlestick", Time>>();
  const [barSeries, setBarSeries] = useState<ISeriesApi<"Histogram", Time>>();

  const uppercaseSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.uppercaseSymbol;
  });

  useEffect(() => {
    // 容器資料都準備好才開始渲染
    if (container) {
      container.innerHTML = "";
      if (chartRef.current) {
        chartRef.current.remove();
      }

      const { candlestickSeries, chart, volumeSeries } =
        generateKlineChart(container);
      setLineSeries(candlestickSeries);
      setBarSeries(volumeSeries);

      chart.subscribeCrosshairMove((param) => {
        if (param.time) {
          const data = param.seriesData.get(candlestickSeries) as OhlcData;
          setLegendsData(data)
        } else {
          // 滑鼠離開圖表返回父層重製數據
          resetLegendsData()
        }
      });
      chartRef.current = chart;
    }
  }, [uppercaseSymbol, container]);

  return { lineSeries, barSeries };
}
