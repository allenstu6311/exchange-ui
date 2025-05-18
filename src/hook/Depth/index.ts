import { DepthTable, UseDepthDataParam } from "@/types";
import { useEffect, useRef, useState } from "react";
import { getDepthData } from "@/api/service/exchange/exchange";
import { handleDepthData } from "./utils";
import worker from "@/workers";

export function useDepthData({
  symbol = "btcusdt",
  deep = 20,
}: UseDepthDataParam) {
  const [askData, setAskData] = useState<DepthTable[]>([]);
  const [bidsData, setBidsData] = useState<DepthTable[]>([]);

  useEffect(() => {
    const getDepthDataIn = async () => {
      const res = await getDepthData({ symbol: symbol.toUpperCase() });
      const askData = handleDepthData(res.data.asks.reverse());
      const bidsData = handleDepthData(res.data.bids);

      setAskData(askData.reverse());
      setBidsData(bidsData);

      worker.postMessage({
        type: "depth",
        url: `wss://stream.binance.com:9443/ws/${symbol}@depth${deep}@1000ms`,
      });
    };

    function handleWsDepth(response: MessageEvent) {
      if (response.data.type !== "depth") return;
      const { asks, bids } = response.data?.data || {};

      if (asks) {
        setAskData(handleDepthData(asks).reverse());
      }
      if (asks) {
        setBidsData(handleDepthData(bids));
      }
    }

    getDepthDataIn();
    worker.subscribe(handleWsDepth);

    return () => worker.destroy(handleWsDepth);
  }, [symbol, deep]);

  return {
    askData,
    bidsData,
  };
}

/**
 * 在元件內做判斷顏色與箭頭
 */
export function usePriceDirection(lastPrice: string) {
  const prevPrice = useRef<number | null>(null);
  const [direction, setDirection] = useState<"up" | "down" | "same">("same");

  useEffect(() => {
    const current = Number(lastPrice);
    const previous = prevPrice.current;

    if (previous !== null) {
      if (current > previous) {
        setDirection("up");
      } else if (current < previous) {
        setDirection("down");
      } else {
        setDirection("same");
      }
    }

    prevPrice.current = current;
  }, [lastPrice]);

  return direction;
}
