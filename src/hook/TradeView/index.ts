import { log } from "node:console";
import { klineTimelyData } from "./../../store/kline";
import { getKlinesData } from "@/api/service/exchange/exchange";
import { AppDispatch, RootState, setKlineTimelyData } from "@/store";
import { IKlineData } from "./types";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateKlineChart, transformKlineData } from "./utils";
import worker from "@/workers";
import {
  BarData,
  IChartApi,
  ISeriesApi,
  OhlcData,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { Lengend } from "@/components/_TradeView";
import { createRoot } from "react-dom/client";

export function useKlineData() {
  const [KlineData, setKlineData] = useState<IKlineData[]>([]);
  const [WsKlineData, setWsKlineData] = useState<IKlineData>({
    time: 0 as UTCTimestamp,
    open: 0,
    high: 0,
    low: 0,
    close: 0,
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
        setKlineData(klineData);
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
      setWsKlineData(data);
      dispatch(setKlineTimelyData({ ...data }));
    };

    getKlinesDataIn();
    worker.subscribe(handleWsKlineData);
    return () => worker.destroy(handleWsKlineData);
  }, [uppercaseSymbol, lowercaseSymbol, dispatch]);

  return { KlineData, WsKlineData };
}

export function useKlineChart(
  container: HTMLElement | null,
  WsKlineData: IKlineData
) {
  const chartRef = useRef<IChartApi>(null);
  const [series, setSeries] = useState<ISeriesApi<"Candlestick", Time>>();

  const uppercaseSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.uppercaseSymbol;
  });

  const hasInitializedRef = useRef(false);

  const latestWsDataRef = useRef(WsKlineData);

  useEffect(() => {
    latestWsDataRef.current = WsKlineData;
  }, [WsKlineData]);

  useEffect(() => {
    // 容器資料都準備好才開始渲染
    if (!hasInitializedRef.current && container && WsKlineData.time) {
      hasInitializedRef.current = true; //避免Ws影響
      container.innerHTML = "";
      if (chartRef.current) {
        chartRef.current.remove();
      }

      const { candlestickSeries, chart } = generateKlineChart(container);
      setSeries(candlestickSeries);

      const legendContainer = document.createElement("div");
      container.appendChild(legendContainer);
      const legendRoot = createRoot(legendContainer);

      legendRoot.render(
        React.createElement(Lengend, {
          ...WsKlineData,
        })
      );

      chart.subscribeCrosshairMove((param) => {
        if (param.time) {
          const data = param.seriesData.get(candlestickSeries) as OhlcData;

          legendRoot.render(
            React.createElement(Lengend, {
              ...data, // BarData: open, high, low, close
            })
          );
        } else {
          legendRoot.render(
            React.createElement(Lengend, {
              ...latestWsDataRef.current,
            })
          );
        }
      });
      chartRef.current = chart;
    }
  }, [uppercaseSymbol, container, WsKlineData]);

  return { series };
}
