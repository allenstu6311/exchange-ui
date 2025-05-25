import { Ticker24hrStat } from "@/types";
import { formatNumWithComma, formatNumToFixed } from "@/utils";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePriceDirection } from "@/hook/Depth";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";

export default function TradingPairHeader() {
  const slashSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.slashSymbol;
  });

  const currentMarketData: Ticker24hrStat = useSelector((state: RootState) => {
    return state.ticker24hrData.map;
  });

  const currSymbolInfo:ISymbolInfoWithPrecision = useSelector((state:RootState)=>{
    return state.symbolInfoList.currentSymbolInfo
  })

  const { showPrecision } = currSymbolInfo;

  const {
    lastPrice,
    highPrice,
    lowPrice,
    quoteVolume,
    volume,
    priceChangePercent,
  } = currentMarketData;
  
  const isRise = Number(priceChangePercent) > 0;
  const direction = usePriceDirection(lastPrice);

  const headerData = [
    {
      title: slashSymbol,
      content: "Bitcoin",
      titleClass: "text-20px",
    },
    {
      title: formatNumToFixed(lastPrice, showPrecision),
      content: `$${formatNumToFixed(lastPrice, showPrecision)}`,
      titleClass: `text-20px ${direction === "up" ? "text-fall" : "text-rise"}`,
    },
    {
      title: "24h漲跌",
      content: `${
        isRise
          ? `+${formatNumToFixed(priceChangePercent)}`
          : `${formatNumToFixed(priceChangePercent)}`
      }
      %`,

      contentClass: `${isRise ? "text-fall" : "text-rise"}`,
    },
    {
      title: "24h最高價",
      content: formatNumWithComma(highPrice, showPrecision),
    },
    {
      title: "24h最低價",
      content: formatNumWithComma(lowPrice, showPrecision),
    },
    {
      title: "24h成交量",
      content: formatNumWithComma(volume),
    },
    {
      title: "24h成交額",
      content: formatNumWithComma(quoteVolume),
    },
  ];

  return (
    <div className="">
      <div className="flex gap-16px px-16px py-4px items-center">
        {headerData.map((item, index) => {
          return (
            <div className="min-w-100px" key={index}>
              <p className={`${item.titleClass} text-12px`}>{item.title}</p>
              <p className={`${item.contentClass} text-12px`}>{item.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
