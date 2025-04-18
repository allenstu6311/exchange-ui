import { Ticker24hrStat } from "@/types";
import { useEffect, useRef, useState } from "react";
import CTable from "@/components/table";
import { formatNumToFixed } from "@/utils";
import worker from "@/workers";
import { getTickerBy24hr } from "@/api/service/exchange";

export default function Market() {
  const [marketData, setMarketData] = useState<Ticker24hrStat[]>([]);
  const marketDataRef = useRef<any[]>([]);

  const tableHeader = [
    {
      label: "交易對",
      key: "symbol",
    },

    {
      label: "最新價",
      key: "askPrice",
      format: (val: string) => formatNumToFixed(val),
    },
    {
      label: "24h漲跌",
      key: "priceChangePercent",
      format: (val: string) => {
        const isRise = Number(val) > 0;
        const formatVal = formatNumToFixed(val);
        return isRise ? `+${formatVal}%` : `${formatVal}%`;
      },
      getStyle: (val: string) => ({
        color: Number(val) > 0 ? "green" : "red",
      }),
    },
  ];

  const handleTickerData = (
    newData: Ticker24hrStat[],
    oldData: Ticker24hrStat[]
  ): Ticker24hrStat[] => {
    return oldData.map((oldItem) => {
      const newItem = newData.find((item) => item.symbol === oldItem.symbol);

      if (newItem) {
        return {
          ...oldItem,
          ...newItem,
        };
      }
      return oldItem;
    });
  };

  useEffect(() => {
    const getTickerBy24hrIn = async () => {
      const res = await getTickerBy24hr();
      setMarketData(res.data);

      worker.postMessage({
        type: "ticker",
        url: "wss://stream.binance.com:9443/ws/!ticker@arr",
      });
    };

    function handleWsTicker(response: MessageEvent) {
      const { type, data } = response.data;
      if (type === "ticker" && marketDataRef.current.length) {
        setMarketData(handleTickerData(data, marketDataRef.current));
      }
    }

    getTickerBy24hrIn();
    worker.addEventListener("message", handleWsTicker);

    return () => worker.removeEventListener("message", handleWsTicker);
  }, []);
  useEffect(() => {
    marketDataRef.current = marketData;
  }, [marketData]);

  return (
    <div className="">
      <CTable columnData={tableHeader} rowData={marketData} />
    </div>
  );
}
