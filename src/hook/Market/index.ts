import { getTickerBy24hr } from "@/api/service/exchange/exchange";
import { Ticker24hrStat } from "@/types";
import worker from "@/workers";
import { useCallback, useEffect, useState } from "react";
import { handleTickerData } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
  setCacheTicker24hData,
  setTicker24hData,
  setTicker24hList,
} from "@/store";

export function useMarketData() {
  const [marketData, setMarketData] = useState<Ticker24hrStat[]>([]);

  const uppercaseSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.uppercaseSymbol;
  });
  const dispatch = useDispatch<AppDispatch>();
  // 設定當前幣對的即時價格
  const setImmediateSymbolTicker = useCallback(
    (data: Ticker24hrStat[], init?: boolean) => {
      const targetSymbolTicker = data.find(
        (item: Ticker24hrStat) => item.symbol === uppercaseSymbol
      );

      if (targetSymbolTicker) {
        dispatch(setTicker24hData(targetSymbolTicker));

        if (init) {
          dispatch(setCacheTicker24hData(targetSymbolTicker));
        }
      }
    },
    [uppercaseSymbol, dispatch]
  );

  useEffect(() => {
    const getTickerBy24hrIn = async () => {
      const res = await getTickerBy24hr();
      setMarketData(res.data.filter((item) => item.symbol.endsWith("USDT")));
      setImmediateSymbolTicker(res.data, true);
      dispatch(setTicker24hList(res.data));

      worker.postMessage({
        type: "ticker",
        // url: "wss://stream.binance.com:9443/ws/!ticker@arr",
        param: ["!ticker@arr"],
      });
    };

    function handleWsTicker(response: MessageEvent) {
      const { type, data } = response.data;
      // console.log("data", data);

      if (type === "ticker" && data) {
        setMarketData((prev) => handleTickerData(data, prev));
        setImmediateSymbolTicker(data);
        setTicker24hList(data);
        dispatch(setTicker24hList(data));
      }
    }

    getTickerBy24hrIn();
    worker.subscribe(handleWsTicker);

    return () => worker.destroy(handleWsTicker);
  }, [setImmediateSymbolTicker]);

  return { marketData };
}
