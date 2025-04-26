import CTable from "@/components/table";
import { formatNumToFixed } from "@/utils";
import { useMarketData } from "@/hook/Market";
import { Input } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { SymbolInfoListTypes } from "@/types";
import { setSymbolName } from "@/store";
import { getCurrentSymbolInfo } from "@/hook/Market/utils";

export default function Market() {
  const symbolInfoList: SymbolInfoListTypes[] = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.list;
    }
  );
  // console.log("symbolInfoList", symbolInfoList);

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
            setSymbolName(getCurrentSymbolInfo(item.symbol, symbolInfoList))
          );
        }}
        rowStyle={{ cursor: "pointer" }}
      />
    </div>
  );
}
