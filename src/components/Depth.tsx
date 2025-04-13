import { getDepthData } from "@/api/service/exchange";
import { useEffect, useState } from "react";
import CTable from "./table";
import { formatNumToFixed } from "@/utils";
import { DepthResponse, DepthTable } from "@/types";
import { Td } from "@chakra-ui/react";
import worker from "@/workers";

export default function Depth() {
  const tableHeader = [
    {
      label: "價格 (USDT)",
      key: "price",
      format: (val: string) => formatNumToFixed(val),
      getStyle: (val: string) => ({
        color: "red",
      }),
    },

    {
      label: "數量(BTC)",
      key: "volume",
      format: (val: string) => formatNumToFixed(val, 5),
    },
    {
      label: "成交額",
      key: "amount",
      format: (val: string) => {
        return val?.slice(0, 9);
      },
      render: (content: any, item: any, columnIndex: number) => {
        return (
          <Td key={columnIndex}>
            {content}
            <div
              className={`absolute bg-red right-0 top-0 h-full opacity-40 transition-all duration-300`}
              style={{ width: `${item.ratio}%` }}
            ></div>
          </Td>
        );
      },
    },
  ];
  const [askData, setAskData] = useState<DepthTable[]>([]);
  const [bidsData, setBidsData] = useState([]);
  const [rowStyle, setRowStyle] = useState({});

  function handleDepthData(depthData: string[][]): DepthTable[] {
    const maxPrice = Math.max(
      ...depthData
        .map((row) => parseFloat(row[0]))
        .filter((price) => !isNaN(price))
    );

    return depthData.map((item) => {
      const amount = Number(item[0]) * Number(item[1]);
      return {
        price: item[0],
        volume: item[1],
        amount,
        ratio: (amount / maxPrice) * 100,
      };
    });
  }

  useEffect(() => {
    const getDepthDataIn = async () => {
      const res = await getDepthData();
      const askData = handleDepthData(res.data.asks);
      setAskData(askData.slice(0, 20));
      setRowStyle({
        position: " relative",
      });

      const symbol = "btcusdt";
      const deep = "20";
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
    }

    getDepthDataIn();
    worker.addEventListener("message", handleWsDepth);

    return () => worker.removeEventListener("message", handleWsDepth);
  }, []);
  return (
    <div className="">
      <div className="">
        <p>委託訂單</p>
      </div>

      <CTable columnData={tableHeader} rowData={askData} rowStyle={rowStyle} />
    </div>
  );
}
