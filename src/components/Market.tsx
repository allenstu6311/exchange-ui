import CTable from "@/components/table";
import { formatNumToFixed } from "@/utils";
import { useMarketData } from "@/hook/Market";
import { Input } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, setPrettySymbol, setSymbol } from "@/store";
import { symbol } from "framer-motion/client";
import { ExchangeSymbolMeta } from "@/types";

export default function Market() {
  const exchangeSymbolMeta: ExchangeSymbolMeta[] = useSelector((state: any) => {
    return state.currentSymbol.exchangeSymbolMeta;
  });

  const { marketData } = useMarketData();
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
      className: (val: string) => {
        return Number(val) > 0 ? "text-fall" : "text-rise";
      },
    },
  ];
  const dispatch = useDispatch<AppDispatch>();

  const generatePrettySymbol = (symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    const currentSymbolInfo = exchangeSymbolMeta.find(
      (item) => item.symbol === upperSymbol
    );

    if (currentSymbolInfo) {
      const { baseAsset, quoteAsset } = currentSymbolInfo;
      return `${baseAsset}/${quoteAsset}`;
    }

    return "";
  };

  return (
    <div className="">
      <div className="p-8px">
        <Input placeholder="請輸入幣對名稱" />
      </div>
      <CTable
        columnData={tableHeader}
        rowData={marketData}
        trOnClick={(item) => {
          dispatch(
            setSymbol({
              symbol: item.symbol.toLowerCase(),
            })
          );
          dispatch(
            setPrettySymbol({
              prettySymbol: generatePrettySymbol(item.symbol),
            })
          );
        }}
        rowStyle={{ cursor: "pointer" }}
      />
    </div>
  );
}
