import CTable from "@/components/table";
import { formatNumToFixed } from "@/utils";
import { useMarketData } from "@/hook/Market";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Ticker24hrStat } from "@/types";
import { getCurrentSymbolInfo } from "@/hook/Market/utils";
import { useMemo, useState } from "react";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { useNavigate } from "react-router";
import { SmallCloseIcon, SearchIcon } from "@chakra-ui/icons";

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

  const [searchStr, setsearchStr] = useState("");
  const visibleMarketData: Ticker24hrStat[] = useMemo(() => {
    return searchStr
      ? marketData.filter((item) => item.symbol.includes(searchStr))
      : marketData;
  }, [marketData, searchStr]);

  return (
    <div className="h-[calc(100%-95px)]">
      <div className="p-8px">
        <InputGroup>
          <InputLeftElement>
            <SearchIcon />
          </InputLeftElement>
          <Input
            value={searchStr}
            placeholder="請輸入幣對名稱"
            onInput={(e) => setsearchStr((e.target as HTMLInputElement).value)}
          />
          {searchStr && (
            <InputRightElement>
              <SmallCloseIcon
                className="cursor-pointer"
                onClick={() => setsearchStr("")}
              />
            </InputRightElement>
          )}
        </InputGroup>
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

          /**
           * 維護性會降低，因為是利用URL變更的副作用
           * 可以再思考有無更好的做法
           */
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
