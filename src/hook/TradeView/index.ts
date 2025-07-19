import { getKlinesData } from "@/api/service/exchange/exchange";
import { AppDispatch, RootState, setKlineTimelyData } from "@/store";
import { IBarData, IKlineData, ISetLegendsData } from "./types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateMA,
  generateKlineChart,
  getMaData,
  transformBarData,
  transformKlineData,
} from "./utils";
import worker from "@/workers";
import {
  HistogramData,
  IChartApi,
  ISeriesApi,
  OhlcData,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { ISymbolInfoWithPrecision } from "../Market/types";

export function useKlineData(
  setLegendsData: React.Dispatch<
    React.SetStateAction<OhlcData<Time>>
  >
) {
  const [KlineData, setKlineData] = useState<IKlineData[]>([]);
  const [WsKlineData, setWsKlineData] = useState<IKlineData | null>();
  const [barData, setBarData] = useState<IBarData[]>([]);
  const [WsBarData, setWsBarData] = useState<IBarData | null>(null)

  const { lowercaseSymbol, uppercaseSymbol } = useSelector((state: RootState) => {
    return state.symbolNameMap;
  });

  const setLegendsDataRef =
    useRef<React.Dispatch<React.SetStateAction<OhlcData<Time>>>>(
      setLegendsData
    );

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
        setLegendsDataRef.current(klineData[klineData.length - 1]);
        setBarData(barData);
      }

      worker.postMessage({
        type: "kline",
        // url: `wss://stream.binance.com:9443/ws/${lowercaseSymbol}@kline_1d`,
        param: [`${lowercaseSymbol}@kline_1d`],
      });

      return res.success ? transformKlineData(res.data) : [];
    };

    const handleWsKlineData = (response: MessageEvent) => {
      const { type, data } = response.data;
      if (type !== "kline") return;
      const { kline, bar } = data;
      setWsKlineData(kline);
      setWsBarData(bar);

      /**
       * Redux會對物件做「凍結」處理，導致light-chart無法
       * 設定必要屬性，所以使用淺拷貝分開
       */
      dispatch(setKlineTimelyData({ ...kline }));
    };
    setWsKlineData(null);
    getKlinesDataIn();
    worker.subscribe(handleWsKlineData);
    return () => worker.destroy(handleWsKlineData);
  }, [uppercaseSymbol, lowercaseSymbol, dispatch]);

  return { KlineData, WsKlineData, barData, WsBarData };
}

export function useKlineChart(
  container: React.RefObject<HTMLDivElement | null>,
  setLegendsData: () => ISetLegendsData,
  resetLegendsData: () => void,
  KlineData: React.RefObject<IKlineData[]>
) {
  // Redux
  const { uppercaseSymbol } = useSelector((state: RootState) => {
    return state.symbolNameMap;
  });

  const { showPrecision, tickSize }: ISymbolInfoWithPrecision = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.currentSymbolInfo;
    }
  );

  // 圖表
  const chartRef = useRef<IChartApi>(null);
  const [lineSeries, setLineSeries] =
    useState<ISeriesApi<"Candlestick", Time>>();
  const [barSeries, setBarSeries] = useState<ISeriesApi<"Histogram", Time>>();

  // 價格格式
  const priceFormat = useMemo(() => {
    return {
      precision: showPrecision,
      minMove: tickSize,
    };
  }, [showPrecision, tickSize]);

  // 重製數據
  const resetLegendsDataRef = useRef<() => void>(resetLegendsData);
  // 設定數據
  const setLegendsDataRef = useRef<() => ISetLegendsData>(setLegendsData);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = "";
      if (chartRef.current) {
        chartRef.current.remove();
      }
      const { precision, minMove } = priceFormat;
      const { candlestickSeries, chart, volumeSeries } = generateKlineChart(
        container.current,
        {
          priceFormat: {
            precision,
            minMove,
          },
        }
      );
      setLineSeries(candlestickSeries);
      setBarSeries(volumeSeries);

      // 滑鼠移動時，更新數據
      chart.subscribeCrosshairMove((param) => {
        if (param.time) {
          const { setOhlcData, setMaData } = setLegendsDataRef.current();
          const lineData = param.seriesData.get(candlestickSeries) as OhlcData;
          const barData = param.seriesData.get(volumeSeries) as HistogramData;
          setOhlcData(lineData);
          setMaData(getMaData(KlineData.current, lineData));
          // setBarDataRef.current(barData);
          // console.log('barData', barData);

        } else {
          // 滑鼠離開圖表返回父層重製數據
          resetLegendsDataRef.current();
        }
      });
      chartRef.current = chart;
    }
  }, [uppercaseSymbol, KlineData, container, priceFormat]);

  return { lineSeries, barSeries };
}
