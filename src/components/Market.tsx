import CTable from "@/components/table";
import { formatNumToFixed } from "@/utils";
import { useMarketData } from "@/hook/Market";
import { Input } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { SymbolInfoListTypes, Ticker24hrStat } from "@/types";
import { setSymbolName } from "@/store";
import { getCurrentSymbolInfo } from "@/hook/Market/utils";
import { useEffect, useRef, useState } from "react";

export default function Market() {
  const symbolInfoList: SymbolInfoListTypes[] = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.list;
    }
  );

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

  const [visibleMarketData, setVisibleMarketData] =
    useState<Ticker24hrStat[]>(marketData);
  const [filtering, setfiltering] = useState(false);

  useEffect(() => {
    if (!filtering) {
      setVisibleMarketData(marketData);
    }
  }, [marketData]);

  const filterMarketData = (value: string) => {
    if (value) {
      setfiltering(true);
      setVisibleMarketData(
        visibleMarketData.filter((item) => item.symbol.includes(value))
      );
    } else {
      setfiltering(false);
      setVisibleMarketData(marketData)
    }
  };

  return (
    <div className="h-full">
      <div className="p-8px">
        <Input
          placeholder="請輸入幣對名稱"
          onInput={(e) =>
            filterMarketData((e.target as HTMLInputElement).value)
          }
        />
      </div>
      <CTable
        columnData={tableHeader}
        rowData={visibleMarketData}
        trOnClick={(item) => {
          dispatch(
            setSymbolName(getCurrentSymbolInfo(item.symbol, symbolInfoList))
          );
        }}
        rowStyle={{ cursor: "pointer" }}
      />
    </div>
  );
}
