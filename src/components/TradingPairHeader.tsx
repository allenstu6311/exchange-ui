import { Ticker24hrStat } from "@/types";
import { formatNumWithComma, formatNumToFixed } from "@/utils";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function TradingPairHeader() {
  const slashSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.slashSymbol;
  });

  const currentMarketData: Ticker24hrStat = useSelector((state: RootState) => {
    return state.currentSymbol.marketData;
  });

  const {
    lastPrice,
    highPrice,
    lowPrice,
    quoteVolume,
    volume,
    priceChangePercent,
  } = currentMarketData;

  const isRise = Number(priceChangePercent) > 0;

  const headerData = [
    {
      title: slashSymbol,
      content: "Bitcoin",
      titleClass: "text-20px",
    },
    {
      title: formatNumWithComma(lastPrice),
      content: `$${formatNumWithComma(lastPrice)}`,
      titleClass: `text-20px ${isRise ? "text-fall" : "text-rise"}`,
    },
    {
      title: "24h漲跌",
      content: `${
        isRise
          ? `+${formatNumToFixed(priceChangePercent)}`
          : `-${formatNumToFixed(priceChangePercent)}`
      }
      %`,

      contentClass: `${isRise ? "text-fall" : "text-rise"}`,
    },
    {
      title: "24h最高價",
      content: formatNumWithComma(highPrice),
    },
    {
      title: "24h最低價",
      content: formatNumWithComma(lowPrice),
    },
    {
      title: "24h成交價",
      content: formatNumWithComma(quoteVolume),
    },
    {
      title: "24h成交額",
      content: formatNumWithComma(volume),
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
