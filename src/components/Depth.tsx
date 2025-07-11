import { useEffect, useRef, useState } from "react";
import CTable from "./table";
import { formatNumToFixed } from "@/utils";
import { IDepthTable } from "@/hook/Depth/types";
import { useDispatch, useSelector } from "react-redux";
import { useDepthData, usePriceDirection } from "@/hook/Depth";
import { AppDispatch, RootState } from "@/store";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { formatNumberAbbr } from "@/utils/format";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

export default function Depth() {
  const currSymbolInfo: ISymbolInfoWithPrecision = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.currentSymbolInfo;
    }
  );

  const {
    showPrecision,
    baseAsset,
    quoteAsset,
    tradePrecision,
    quoteAssetPrecision,
  } = currSymbolInfo;

  const asksHeader = [
    {
      label: `價格 (${quoteAsset})`,
      key: "price",
      format: (val: string, item: any) => formatNumToFixed(val, showPrecision),
      className: "text-rise",
    },

    {
      label: `數量(${baseAsset})`,
      key: "volume",
      format: (val: string) => formatNumberAbbr(val, tradePrecision),
    },
    {
      label: "成交額",
      key: "amount",
      format: (val: string) => {
        return val;
      },
      render: (content: number, item: IDepthTable, columnIndex: number) => {
        return (
          <>
            {formatNumberAbbr(content, tradePrecision)}
            <div
              className={`absolute bg-rise right-0 top-0 h-full opacity-40 transition-all duration-500`}
              style={{ width: `${item.ratio}%` }}
            ></div>
          </>
        );
      },
    },
  ];
  const bidsHeader = [
    {
      label: "",
      key: "price",
      format: (val: string) => formatNumToFixed(val, showPrecision),
      className: "text-fall",
    },

    {
      label: "",
      key: "volume",
      format: (val: string) => formatNumberAbbr(val, tradePrecision),
    },
    {
      label: "",
      key: "amount",
      format: (val: string) => {
        return val;
      },
      render: (content: number, item: IDepthTable, columnIndex: number) => {
        return (
          <>
            {formatNumberAbbr(content, tradePrecision)}
            <div
              className={`absolute bg-fall right-0 top-0 h-full opacity-40 transition-all duration-500`}
              style={{ width: `${item.ratio}%` }}
            ></div>
          </>
        );
      },
    },
  ];

  const currentMarketData = useSelector((state: RootState) => {
    return state.ticker24hrData.map;
  });

  const { askData, bidsData } = useDepthData();
  const [rowStyle, setRowStyle] = useState({});

  const direction = usePriceDirection(currentMarketData.lastPrice);
  const arrow =
    direction === "up" ? (
      <ArrowUpIcon />
    ) : direction === "down" ? (
      <ArrowDownIcon />
    ) : (
      "-"
    );
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
        className={`text-20px flex items-center gap-5px px-16px py-5px ${lasPriceStyle}`}
      >
        <p>{formatNumToFixed(currentMarketData.lastPrice, showPrecision)}</p>
        <p> {arrow}</p>
      </div>
      <CTable columnData={bidsHeader} rowData={bidsData} rowStyle={rowStyle} />
    </div>
  );
}
