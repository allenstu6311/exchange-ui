import { DepthTable, UseDepthDataParam } from "@/types";
import { useEffect, useState } from "react";
import { getDepthData } from "@/api/service/exchange";
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
      const res = await getDepthData();
      const askData = handleDepthData(res.asks);
      const bidsData = handleDepthData(res.bids);

      setAskData(askData.slice(0, 20));
      setBidsData(bidsData.slice(0, 20));

      worker.postMessage({
        type: "depth",
        url: `wss://stream.binance.com:9443/ws/${symbol}@depth${deep}@1000ms`,
      });
    };

    function handleWsDepth(response: MessageEvent) {
      if (response.data.type !== "depth") return;
      const { asks, bids } = response.data?.data || {};
      if (asks) {
        setAskData(handleDepthData(asks));
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
