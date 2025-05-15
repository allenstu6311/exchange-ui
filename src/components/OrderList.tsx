import { getCurrentOrder, cancleOrder } from "@/api/service/exchange";
import { ICurrentOrder } from "@/types";
import { useEffect, useState } from "react";
import CTable from "./table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, setCurrentOrder } from "@/store";
import { Button } from "@chakra-ui/react";

export default function OrderList() {
  const dispatch = useDispatch<AppDispatch>();
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
    {
      label: "操作",
      key: "operation",
      render: (content: string, rowData: ICurrentOrder) => {
        return (
          <div className="my-5px">
            <Button
              className=""
              size="xs"
              onClick={() => {
                handleCancelOrder(rowData);
              }}
            >
              取消訂單
            </Button>
          </div>
        );
      },
    },
  ];

  const uppercaseSymbol = useSelector((state: RootState) => {
    return state.symbolNameMap.uppercaseSymbol;
  });

  const orderMap = useSelector((state: RootState) => {
    return state.orderMap;
  });

  useEffect(() => {
    async function getCurrentOrderIn() {
      const res = await getCurrentOrder({
        symbol: uppercaseSymbol,
      });
      dispatch(setCurrentOrder(res.data));
    }

    getCurrentOrderIn();
  }, [uppercaseSymbol]);

  const handleCancelOrder = async (orderInfo: ICurrentOrder) => {
    console.log("orderInfo", orderInfo);
    const { symbol, orderId, side } = orderInfo;

    const res = await cancleOrder({
      symbol,
      orderId,
      timestamp: Date.now(),
    });

    if (res.success) {
      const newOrderMap = orderMap.current.filter(
        (item: ICurrentOrder) => item.orderId !== orderId
      );
      dispatch(setCurrentOrder(newOrderMap));
    }
  };

  return (
    <div className="">
      <CTable columnData={columnData} rowData={orderMap.current}></CTable>
    </div>
  );
}
