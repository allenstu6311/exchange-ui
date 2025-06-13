import {
  createOrder,
  getAccountInfo,
  getCurrentOrder,
} from "@/api/service/exchange/exchange";
import { IAccountInfo, OrderRequest, OrderSide, OrderType } from "@/types";
import { useEffect, useState } from "react";
import classNames from "classnames";
import ExForm from "@/components/form/exForm";
import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, setCurrentOrder } from "@/store";
import { createDefaultOrderRequest } from "@/hook/TradeForm/utils";
import { useTradeAvailability } from "@/hook/TradeForm";
import CTabs, { ITabData } from "@/components/tabs/index";
import { useRef } from "react";
import { formatNumToFixed } from "@/utils";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { IFormRef } from "./form/exForm/types";

export default function TradeForm() {
  const dispatch = useDispatch<AppDispatch>();
  const symbolMap = useSelector((state: RootState) => {
    return state.symbolNameMap;
  });

  const currSymbolInfo: ISymbolInfoWithPrecision = useSelector(
    (state: RootState) => {
      return state.symbolInfoList.currentSymbolInfo;
    }
  );
  const { showPrecision } = currSymbolInfo;

  const [tradeType, setTradeType] = useState<OrderType>("LIMIT");
  const isLimit = tradeType === "LIMIT";
  const isMarket = tradeType === "MARKET";
  const { base, quote, uppercaseSymbol } = symbolMap;

  const buyFormRef = useRef<IFormRef>(null);
  const sellFormRef = useRef<IFormRef>(null);

  const [accountInfo, setAccountInfo] = useState<IAccountInfo>();
  const balances = accountInfo?.balances ?? [];

  const { maxBuyQty, quoteFree, maxSellAmount, baseFree } =
    useTradeAvailability(balances, base, quote);

  const getAccountInfoIn = async () => {
    const res = await getAccountInfo();
    console.log("res.data", res.data);
    if (res.success) {
      setAccountInfo(res.data);
    }
  };

  useEffect(() => {
    getAccountInfoIn();
    resetForm();
  }, [base]);

  const resetForm = () => {
    buyFormRef.current?.reset();
    sellFormRef.current?.reset();
  };

  const tradeBtnClick = async (side: OrderSide) => {
    const currFormRef = side === OrderSide.BUY ? buyFormRef : sellFormRef;
    const order = currFormRef.current?.getFormData();

    const requestData = createDefaultOrderRequest({
      ...order,
      side,
      symbol: uppercaseSymbol,
      type: tradeType,
    });

    const validateResult = currFormRef.current?.validate();
    if (!validateResult) return;
    if (isMarket) {
      delete requestData.timeInForce;
      delete requestData.price;
    }
    // 下單
    const createRes = await createOrder(requestData);

    // 更新當前訂單
    const orderData = await getCurrentOrder({
      symbol: uppercaseSymbol,
    });
    dispatch(setCurrentOrder(orderData.data));
    await getAccountInfoIn();
    // 重置form
    if (createRes) {
      currFormRef.current?.reset();
    }
  };

  enum TabsType {
    SPOT = 0,
    CROSS = 1,
  }

  const [currTabsIndex, setCurrTabsIndex] = useState<number>(0);

  const tabData = [
    {
      label: "現貨",
      index: 0,
    },
    {
      label: "全倉",
      index: 1,
    },
  ];

  const tabOnChange = (currTab: ITabData) => {
    setCurrTabsIndex(currTab.index);
  };

  return (
    <div className="p-16px">
      <div className="mb-20px">
        <CTabs tabOnChange={tabOnChange} tabData={tabData} />
      </div>
      {/* tab */}
      <div className="flex gap-16px mb-16px">
        <span
          className={classNames("cursor-pointer text-#B7BDC6", {
            "text-black": isLimit,
          })}
          onClick={() => {
            setTradeType("LIMIT");
            resetForm();
          }}
        >
          限價
        </span>
        <span
          className={classNames("cursor-pointer text-#B7BDC6", {
            "text-black": isMarket,
          })}
          onClick={() => {
            setTradeType("MARKET");
            resetForm();
          }}
        >
          市價
        </span>
      </div>
      {/* form */}
      <div
        className="flex gap-16px"
        style={{ display: currTabsIndex === TabsType.SPOT ? "flex" : "none" }}
      >
        {/* 買入 */}
        <div className="w-full">
          <ExForm
            ref={buyFormRef}
            isMarket={isMarket}
            assets={quoteFree}
          ></ExForm>
          {/* 可用 */}
          <div className=" my-8px">
            <div className="flex justify-between">
              <p>可用</p>
              <p>
                {formatNumToFixed(quoteFree, showPrecision)} {quote}
              </p>
            </div>
            <div className="flex justify-between">
              <p>最大買入</p>
              <p>
                {formatNumToFixed(maxBuyQty, showPrecision)} {base}
              </p>
            </div>
            {/* <div className="flex justify-between">
              <p>預估手續費</p>
              <p>0 {quote}</p>
            </div> */}
          </div>
          <Button
            colorScheme="blue"
            w="100%"
            onClick={() => tradeBtnClick(OrderSide.BUY)}
          >
            買入 {base}
          </Button>
        </div>
        {/* 賣出 */}
        <div className="w-full">
          <ExForm
            ref={sellFormRef}
            isMarket={isMarket}
            assets={maxSellAmount}
          ></ExForm>
          {/* 可用 */}
          <div className="my-8px">
            <div className="flex justify-between">
              <p>可用</p>
              <p>
                {formatNumToFixed(baseFree, showPrecision)} {base}
              </p>
            </div>
            <div className="flex justify-between">
              <p>最大賣出</p>
              <p>
                {formatNumToFixed(maxSellAmount, showPrecision)} {quote}
              </p>
            </div>
            {/* <div className="flex justify-between">
              <p>預估手續費</p>
              <p>0 {quote}</p>
            </div> */}
          </div>
          <Button
            colorScheme="red"
            w="100%"
            onClick={() => tradeBtnClick(OrderSide.SELL)}
          >
            賣出 {base}
          </Button>
        </div>
      </div>
    </div>
  );
}
