import { getCurrentOrder } from "@/api/service/exchange";
import { ICurrentOrder } from "@/types";
import { useEffect, useState } from "react";
import CTable from "./table";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function OrderList() {
  const columnData = [
    {
      label: "交易對",
      key: "symbol",
    },
    {
      label: "方向",
      key: "side",
    },
    {
      label: "類型",
      key: "type",
    },
    {
      label: "數量",
      key: "origQty",
    },
    {
      label: "價格",
      key: "price",
    },
    {
      label: "狀態",
      key: "status",
    },
    {
      label: "時間",
      key: "workingTime",
    },
  ];

  const uppercaseSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.uppercaseSymbol;
  });

  const [currOrder, setCurrOrder] = useState<ICurrentOrder[]>([]);
  useEffect(() => {
    async function getCurrentOrderIn() {
      const res = await getCurrentOrder({
        symbol: uppercaseSymbol,
      });
      setCurrOrder(res);
    }

    getCurrentOrderIn();
  }, [uppercaseSymbol]);

  return (
    <div className="">
      <CTable columnData={columnData} rowData={currOrder}></CTable>
    </div>
  );
}
