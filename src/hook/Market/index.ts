import { getTickerBy24hr } from "@/api/service/exchange";
import { Ticker24hrStat } from "@/types";
import worker from "@/workers";
import { useCallback, useEffect, useState } from "react";
import { handleTickerData } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, setLastPrice, setCurrMarketData } from "@/store";

export function useMarketData() {
  const [marketData, setMarketData] = useState<Ticker24hrStat[]>([]);

  const currentSymbol = useSelector((state: any) => {
    return state.currentSymbol.symbol;
  });
  const store = useDispatch<AppDispatch>();
  const setImmediateMarketData = useCallback(
    (data: Ticker24hrStat[]) => {
      const targetSymbol = data.find(
        (item: Ticker24hrStat) => item.symbol === currentSymbol.toUpperCase()
      );

      if (targetSymbol) {
        store(
          setCurrMarketData({
            marketData: targetSymbol,
          })
        );
      }
    },
    [currentSymbol, store]
  );

  useEffect(() => {
    const getTickerBy24hrIn = async () => {
      const res = await getTickerBy24hr();
      setMarketData(res.filter((item) => item.symbol.endsWith("USDT")));
      setImmediateMarketData(res);

      worker.postMessage({
        type: "ticker",
        url: "wss://stream.binance.com:9443/ws/!ticker@arr",
      });
    };

    function handleWsTicker(response: MessageEvent) {
      const { type, data } = response.data;

      if (type === "ticker") {
        setMarketData((prev) => handleTickerData(data, prev));
        setImmediateMarketData(data);
      }
    }

    getTickerBy24hrIn();
    worker.subscribe(handleWsTicker);

    return () => worker.destroy(handleWsTicker);
  }, [setImmediateMarketData]);

  return { marketData };
}
