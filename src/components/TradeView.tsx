import { useCallback, useEffect, useRef, useState } from "react";
import { useKlineData, useKlineChart } from "@/hook/TradeView";
import { IKlineData, IMaData, ISetLegendsData } from "@/hook/TradeView/types";
import { OhlcData, Time, UTCTimestamp } from "lightweight-charts";
import dayjs from "dayjs";
import { formatNumToFixed } from "@/utils";
import { RootState } from "@/store";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { useSelector } from "react-redux";
import { getMaData } from "@/hook/TradeView/utils";

export default function TradeView() {
  const chartContainerRef = useRef<HTMLDivElement>(null); // 這裡取得 DOM
  const [ohlcData, setOhlcData] = useState<OhlcData>(
    {
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      time: 0 as Time,
    }
  );
  const [maData, setMaData] = useState<IMaData>({
    ma7: 0,
    ma25: 0,
    ma99: 0,
  });

  const { KlineData, WsKlineData, barData, WsBarData } =
    useKlineData(setOhlcData);

  const latestKlineDataRef = useRef<OhlcData>({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    time: 0 as Time,
  });

  const klineDataRef = useRef(KlineData);

  const { lineSeries, barSeries } = useKlineChart(
    chartContainerRef,
    setLegendsData,
    resetLegendsData,
    klineDataRef
  );

  function setLegendsData(): ISetLegendsData {
    return {
      setOhlcData,
      setMaData
    }
  }

  function resetLegendsData() {
    setOhlcData(latestKlineDataRef.current);
    setMaData(getMaData(klineDataRef.current, latestKlineDataRef.current));
  }

  useEffect(() => {
    if (KlineData.length) {
      lineSeries?.setData(KlineData);
      latestKlineDataRef.current = KlineData[KlineData.length - 1];
      klineDataRef.current = KlineData;
      setMaData(getMaData(klineDataRef.current, latestKlineDataRef.current));
    }
  }, [KlineData, lineSeries]);

  useEffect(() => {
    if (barData.length) {
      barSeries?.setData(barData);
    }
  }, [barData, barSeries]);

  useEffect(() => {
    if (WsKlineData?.time) {
      lineSeries?.update(WsKlineData);
      setOhlcData(WsKlineData);
      setMaData(getMaData(klineDataRef.current, WsKlineData));
      latestKlineDataRef.current = WsKlineData;
    }
  }, [WsKlineData, lineSeries, KlineData]);

  useEffect(() => {
    if (WsBarData?.time) {
      barSeries?.update(WsBarData);
    }
  }, [WsBarData, barSeries]);

  return (
    <>
      <div className="w-full h-full relative">
        <div className="w-full h-full" ref={chartContainerRef}></div>
        <Legends ohlcData={ohlcData} maData={maData} />
      </div>
    </>
  );
}

export function Legends({ 
  ohlcData,
  maData
}: { 
  ohlcData: OhlcData
  maData: IMaData
}) {
  const currSymbolInfo: ISymbolInfoWithPrecision = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.currentSymbolInfo;
    }
  );
  const { showPrecision } = currSymbolInfo;

  if (!ohlcData || !maData) return;

  const ohlcList = [
    {
      label: "開盤價",
      value: ohlcData?.open,
    },
    {
      label: "最高價",
      value: ohlcData?.high,
    },
    {
      label: "最低價",
      value: ohlcData?.low,
    },
    {
      label: "收盤價",
      value: ohlcData?.close,
    },
  ];

  const isRise = ohlcData?.close > ohlcData?.open;

  const MAList = [
    {
      label: "MA(7)",
      value: maData?.ma7,
      color: 'text-orange'
    },
    {
      label: "MA(25)",
      value: maData?.ma25,
      color: 'text-pink'
    },
    {
      label: "MA(99)",
      value: maData?.ma99,
      color: 'text-purple'
    },
  ]
  const commonLegendStyle = "px-5px absolute left-10px z-10 flex gap-10px text-16px font-mono fw-400 hover:border-2px hover:border-grey";
  return (
    <>
      {/* 當前行情 */}
      <div className={`top-5px ${commonLegendStyle}`}>
        <div className="">
          <p>{dayjs(new Date()).format("YYYY/MM/DD")}</p>
        </div>
        {ohlcList.map((item, index) => {
          return (
            <div className="flex ga-3px" key={index}>
              <p>{item.label}: </p>
              <p className={`min-w-[80px] ${isRise ? 'text-rise' : 'text-fall'}`}>
                {formatNumToFixed(item.value, showPrecision)}
              </p>
            </div>
          );
        })}
      </div>
      {/* 移動平均線 MA */}
      <div className={`top-35px ${commonLegendStyle}`}>
        {MAList.map((item, index) => {
          return (
            <div className="flex ga-3px" key={index}>
              <p>{item.label}: </p>
              <p className={`${item.color} min-w-[80px]`}>
                {formatNumToFixed(item.value, showPrecision)}
              </p>
            </div>
          );
        })}
      </div>
    </>

  );
}
