import { getDepthData } from "@/api/service/exchange";
import { useEffect, useState } from "react";
import CTable from "./table";
import { formatNumToFixed } from "@/utils";
import { DepthResponse, DepthTable } from "@/types";
import { Td } from "@chakra-ui/react";
import worker from "@/workers";
import { useSelector } from "react-redux";
import { useDepthData } from "@/hook/Depth";

export default function Depth() {
  const asksHeader = [
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
      render: (content: number, item: DepthTable, columnIndex: number) => {
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
  const bidsHeader = [
    {
      label: "",
      key: "price",
      format: (val: string) => formatNumToFixed(val),
      getStyle: (val: string) => ({
        color: "green",
      }),
    },

    {
      label: "",
      key: "volume",
      format: (val: string) => formatNumToFixed(val, 5),
    },
    {
      label: "",
      key: "amount",
      format: (val: string) => {
        return val?.slice(0, 9);
      },
      render: (content: number, item: DepthTable, columnIndex: number) => {
        return (
          <Td key={columnIndex}>
            {content}
            <div
              className={`absolute bg-green right-0 top-0 h-full opacity-40 transition-all duration-300`}
              style={{ width: `${item.ratio}%` }}
            ></div>
          </Td>
        );
      },
    },
  ];
  const { askData, bidsData } = useDepthData({ symbol: "btcusdt", deep: 20 });
  const [rowStyle, setRowStyle] = useState({});
  const lastPrice = useSelector((state: any) => {
    return state.currentSymbol.lastPrice;
  });

  useEffect(() => {
    setRowStyle({
      position: " relative",
    });
  }, []);
  return (
    <div className="">
      <div className="">
        <p>委託訂單</p>
      </div>
      <CTable columnData={asksHeader} rowData={askData} rowStyle={rowStyle} />
      <div className="">
        <p className="text-20px">{formatNumToFixed(lastPrice, 2)}</p>
      </div>
      <CTable columnData={bidsHeader} rowData={bidsData} rowStyle={rowStyle} />
    </div>
  );
}
