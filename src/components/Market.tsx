import CTable from "@/components/table";
import { formatNumToFixed } from "@/utils";
import { useMarketData } from "@/hook/Market";
import { background, Input } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, setCurrSymbolInfo } from "@/store";
import { SymbolInfoListTypes, Ticker24hrStat } from "@/types";
import { setSymbolName } from "@/store";
import { getCurrentSymbolInfo } from "@/hook/Market/utils";
import { useEffect, useRef, useState } from "react";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { useNavigate } from "react-router";

export default function Market() {
  const navigate = useNavigate();
  const symbolInfoList: ISymbolInfoWithPrecision[] = useSelector(
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
      format: (val: string, data: any) => {
        const currSymbol = symbolInfoList.find(
          (item) => item.symbol === data.symbol
        );
        const precision = currSymbol ? currSymbol.showPrecision : 2;
        return formatNumToFixed(val, precision);
      },
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
  const [hover, setHover] = useState(false);

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
      setVisibleMarketData(marketData);
    }
  };

  return (
    <div className="h-[calc(100%-95px)]">
      <div className="p-8px">
        <Input
          placeholder="請輸入幣對名稱"
          onInput={(e) =>
            filterMarketData((e.target as HTMLInputElement).value)
          }
        />
      </div>
      <CTable
        trHeight={35}
        columnData={tableHeader}
        rowData={visibleMarketData}
        trOnClick={(item: ISymbolInfoWithPrecision) => {
          const currSymbolInfo = getCurrentSymbolInfo(
            item.symbol,
            symbolInfoList
          );
          if (currSymbolInfo) {
            // dispatch(setSymbolName(currSymbolInfo));
            // dispatch(setCurrSymbolInfo(currSymbolInfo));
            navigate(`/${item.symbol}`); // HOME.tsx會自動追蹤URL
          }
        }}
        rowStyle={{
          cursor: "pointer",
        }}
        isHover={true}
        virtualed={true}
      />
    </div>
  );
}
