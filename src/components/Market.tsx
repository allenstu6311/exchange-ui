import CTable from "@/components/table";
import { formatNumToFixed } from "@/utils";
import { useMarketData } from "@/hook/Market";
import { Input } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { AppDispatch, setSymbol } from "@/store";

export default function Market() {
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
  const store = useDispatch<AppDispatch>();

  return (
    <div className="">
      <div className="">
        <Input placeholder="請輸入幣對名稱" />
      </div>
      <CTable
        columnData={tableHeader}
        rowData={marketData}
        trOnClick={(item) => {
          store(
            setSymbol({
              symbol: item.symbol.toLowerCase(),
            })
          );
        }}
        rowStyle={{ cursor: "pointer" }}
      />
    </div>
  );
}
