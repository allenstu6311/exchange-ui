import {
  getCurrentOrder,
  cancleOrder,
  getHistoricalTrades,
} from "@/api/service/exchange/exchange";
import { ICurrentOrder } from "@/types";
import { useEffect, useRef, useState } from "react";
import CTable from "./table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, setCurrentOrder } from "@/store";
import { Button, Td } from "@chakra-ui/react";
import { formatNumToFixed, polling } from "@/utils";
import { IPollingController } from "@/utils/polling";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import dayjs from "dayjs";
import CTabs, { ITabData } from "@/components/tabs/index";
import { OrderStatus, OrderType } from "@/enum/OrderList";
import { IHistoryOrderData } from "@/hook/OrderList/types";
import { orderStatusLabelMap } from "@/hook/OrderList/utils";


export default function OrderList() {
  const dispatch = useDispatch<AppDispatch>();
  const currSymbolInfo: ISymbolInfoWithPrecision = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.currentSymbolInfo;
    }
  );

  const { showPrecision } = currSymbolInfo;

  const [currTabsIndex, setCurrTabsIndex] = useState<number>(0);
  const [historyOrder, setHistoryOrder] = useState<IHistoryOrderData[]>([]);
  const pollingGetCurrentOrder = useRef<IPollingController>(null);

  const currOrderColumn = [
    {
      label: "交易對",
      key: "symbol",
    },
    {
      label: "方向",
      key: "side",
      format: (content: string) => {
        return content === "BUY" ? "買入" : "賣出";
      },
    },
    {
      label: "類型",
      key: "type",
      format: (content: string) => {
        return content === "LIMIT" ? "限價" : "市價";
      },
    },
    {
      label: "數量",
      key: "origQty",
      format: (content: string) => formatNumToFixed(content, showPrecision),
    },
    {
      label: "價格",
      key: "price",
      format: (content: string) => formatNumToFixed(content, showPrecision),
    },
    {
      label: "狀態",
      key: "status",
      format:(content: OrderStatus)=>orderStatusLabelMap[content]
    },
    {
      label: "時間",
      key: "workingTime",
      format: (content: string) => {
        return dayjs(Number(content)).format("YYYY/MM/DD HH:mm:ss");
      },
    },
    {
      label: "操作",
      key: "operation",
      render: (content: string, rowData: ICurrentOrder) => {
        return (
          <Button
            className=""
            size="xs"
            onClick={() => {
              handleCancelOrder(rowData);
            }}
          >
            取消訂單
          </Button>
        );
      },
    },
  ];

  const hisOrderColumn = [
    {
      label: "交易對",
      key: "symbol",
    },
    {
      label: "方向",
      key: "side",
      format: (content: string) => {
        return content === "BUY" ? "買入" : "賣出";
      },
    },
    {
      label: "數量",
      key: "qty",
      format: (content: string) => {
        return formatNumToFixed(content, showPrecision);
      },
    },
    {
      label: "價格",
      key: "price",
      format: (content: string) => {
        return formatNumToFixed(content, showPrecision);
      },
    },
    {
      label: "交易額",
      key: "quoteQty",
      format: (content: string) => {
        return formatNumToFixed(content, showPrecision);
      },
    },
    {
      label: "時間",
      key: "time",
      format: (content: string) => {
        return dayjs(Number(content)).format("YYYY/MM/DD HH:mm:ss");
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

    async function getHistoricalTradesIn() {
      const res = await getHistoricalTrades({
        symbol: uppercaseSymbol,
      });
      setHistoryOrder(res.data);
    }

    if (pollingGetCurrentOrder.current) {
      pollingGetCurrentOrder.current.stop();
    }

    let action;

    switch (currTabsIndex) {
      case OrderType.CURRENT:
        action = getCurrentOrderIn;
        break;
      case OrderType.HISTORY:
        action = getHistoricalTradesIn;
        break;
    }

    pollingGetCurrentOrder.current = polling(action!, 3000);
    pollingGetCurrentOrder.current.start();

    return () => {
      pollingGetCurrentOrder.current?.stop();
    };
  }, [uppercaseSymbol, dispatch, currTabsIndex]);

  const handleCancelOrder = async (orderInfo: ICurrentOrder) => {
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

  const tabData = [
    {
      label: "當前訂單",
      index: 0,
    },
    {
      label: "歷史訂單",
      index: 1,
    },
  ];

  const tabOnChange = (currTab: ITabData) => {
    setCurrTabsIndex(currTab.index);
  };

  return (
    <div className="h-[calc(100%-95px)]">
      <div className="p-5px">
        <CTabs tabOnChange={tabOnChange} tabData={tabData}></CTabs>
      </div>

      {/* 當前訂單 */}
      {currTabsIndex == OrderType.CURRENT && (
        <CTable
          columnData={currOrderColumn}
          rowData={orderMap.current}
        ></CTable>
      )}

      {/* 歷史訂單 */}
      {currTabsIndex == OrderType.HISTORY && (
        <CTable
          columnData={hisOrderColumn}
          rowData={historyOrder}
          trHeight={35}
          virtualed={true}
        ></CTable>
      )}
    </div>
  );
}
