import CTable from "@/components/table";
import { formatNumToFixed } from "@/utils";
import { useMarketData } from "@/hook/Market";

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
      getStyle: (val: string) => ({
        color: Number(val) > 0 ? "green" : "red",
      }),
    },
  ];

  return (
    <div className="">
      <CTable columnData={tableHeader} rowData={marketData} />
    </div>
  );
}
