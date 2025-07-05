import { DepthTable } from "@/types";
import { useEffect, useRef, useState } from "react";
import { getDepthData } from "@/api/service/exchange/exchange";
import { handleDepthData } from "./utils";
import worker from "@/workers";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useDepthData(deep = 20) {
  const [askData, setAskData] = useState<DepthTable[]>([]);
  const [bidsData, setBidsData] = useState<DepthTable[]>([]);

  const { lowercaseSymbol, uppercaseSymbol } = useSelector((state: RootState) => {
    return state.symbolNameMap;
  });

  useEffect(() => {
    const getDepthDataIn = async () => {
      const res = await getDepthData({ symbol: uppercaseSymbol });
      const askData = handleDepthData(res.data.asks.reverse());
      const bidsData = handleDepthData(res.data.bids);

      setAskData(askData.reverse());
      setBidsData(bidsData);

      worker.postMessage({
        type: "depth",
        // url: `wss://stream.binance.com:9443/ws/${symbol}@depth${deep}@1000ms`,
        param: [`${lowercaseSymbol}@depth${deep}@1000ms`],
      });
    };

    function handleWsDepth(response: MessageEvent) {
      if (response.data.type !== "depth") return;
      const { asks, bids } = response.data?.data?.data || {};

      if (asks) {
        setAskData(handleDepthData(asks).reverse());
      }
      if (bids) {
        setBidsData(handleDepthData(bids));
      }
    }

    getDepthDataIn();
    worker.subscribe(handleWsDepth);

    return () => worker.destroy(handleWsDepth);
  }, [lowercaseSymbol, uppercaseSymbol, deep]);

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
