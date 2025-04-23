import { useEffect, useRef, useState } from "react";
import CTable from "./table";
import { formatNumToFixed } from "@/utils";
import { DepthTable } from "@/types";
import { Td } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useDepthData, usePriceDirection } from "@/hook/Depth";
import { AppDispatch } from "@/store";

export default function Depth() {
  const asksHeader = [
    {
      label: "價格 (USDT)",
      key: "price",
      format: (val: string) => formatNumToFixed(val),
      className: "text-rise",
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
              className={`absolute bg-rise right-0 top-0 h-full opacity-40 transition-all duration-300`}
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
      className: "text-fall",
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
              className={`absolute bg-fall right-0 top-0 h-full opacity-40 transition-all duration-300`}
              style={{ width: `${item.ratio}%` }}
            ></div>
          </Td>
        );
      },
    },
  ];

  const currentSymbol = useSelector((state: any) => {
    return state.currentSymbol.symbol ?? "";
  });

  const currentMarketData = useSelector((state: any) => {
    return state.currentSymbol.marketData || {};
  });

  const { askData, bidsData } = useDepthData({
    symbol: currentSymbol,
    deep: 20,
  });
  const [rowStyle, setRowStyle] = useState({});

  const direction = usePriceDirection(currentMarketData.lastPrice);
  const arrow = direction === "up" ? "▲" : direction === "down" ? "▼" : "-";
  const lasPriceStyle = direction === "up" ? "color-rise" : "text-fall";

  useEffect(() => {
    setRowStyle({
      position: " relative",
    });
  }, []);
  return (
    <div className="bg-#FFF">
      <div className="px-16px py-8px  mb-8px border-b-1px border-solid ">
        <p className="text-14px">委託訂單</p>
      </div>
      <CTable columnData={asksHeader} rowData={askData} rowStyle={rowStyle} />
      <div
        className={`text-20px flex items-center gap-5px px-16px py-8px ${lasPriceStyle}`}
      >
        <p>{formatNumToFixed(currentMarketData.lastPrice, 2)}</p>
        <p> {arrow}</p>
      </div>
      <CTable columnData={bidsHeader} rowData={bidsData} rowStyle={rowStyle} />
    </div>
  );
}
