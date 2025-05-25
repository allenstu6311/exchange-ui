import { useCallback, useEffect, useRef, useState } from "react";
import { useKlineData, useKlineChart } from "@/hook/TradeView";
import { IKlineData } from "@/hook/TradeView/types";
import { OhlcData, UTCTimestamp } from "lightweight-charts";
import dayjs from "dayjs";
import { formatNumToFixed } from "@/utils";
import { RootState } from "@/store";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { useSelector } from "react-redux";

export default function TradeView() {
  const chartContainerRef = useRef<HTMLDivElement>(null); // 這裡取得 DOM
  const [legendsData, setLegendsData] = useState<OhlcData>();
  const { KlineData, WsKlineData, barData, WsBarData } =
    useKlineData(setLegendsData);

  const latestKlineDataRef = useRef<any>(null);

  const { lineSeries, barSeries } = useKlineChart(
    chartContainerRef?.current,
    setLegendsData,
    resetLegendsData
  );

  function resetLegendsData() {
    setLegendsData(latestKlineDataRef.current);
  }

  useEffect(() => {
    if (KlineData.length) {
      lineSeries?.setData(KlineData);
      latestKlineDataRef.current = KlineData[KlineData.length - 1];
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
      setLegendsData(WsKlineData);
      latestKlineDataRef.current = WsKlineData;
    }
  }, [WsKlineData, lineSeries]);

  useEffect(() => {
    if (WsBarData.time) {
      barSeries?.update(WsBarData);
    }
  }, [WsBarData, barSeries]);

  return (
    <>
      <div className="w-full h-full relative">
        <div className="w-full h-full" ref={chartContainerRef}></div>
        <Legends data={legendsData} />
      </div>
    </>
  );
}

export function Legends({ data }: { data: OhlcData | undefined }) {
  const currSymbolInfo: ISymbolInfoWithPrecision = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.currentSymbolInfo;
    }
  );
  const { showPrecision } = currSymbolInfo;

  if (!data) return;

  const LegendsData = [
    {
      label: "開盤價",
      value: data?.open,
    },
    {
      label: "最高價",
      value: data?.high,
    },
    {
      label: "最低價",
      value: data?.low,
    },
    {
      label: "收盤價",
      value: data?.close,
    },
  ];

  return (
    <div className="absolute top-5px left-10px z-10 flex gap-5px text-14px  font-mono">
      <div className="">
        <p>{dayjs(new Date()).format("YYYY/MM/DD")}</p>
      </div>
      {LegendsData.map((item, index) => {
        return (
          <div className="flex ga-3px" key={index}>
            <p>{item.label}: </p>
            <p className="text-rise  min-w-[80px]">
              {formatNumToFixed(item.value, showPrecision)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
