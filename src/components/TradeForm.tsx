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

export default function TradeForm() {
  const dispatch = useDispatch<AppDispatch>();
  const symbolMap = useSelector((state: RootState) => {
    return state.symbolNameMap;
  });

  const lastPrice = useSelector((state: RootState) => {
    return state.ticker24hrData.map.lastPrice;
  });

  const orderMap = useSelector((state: RootState) => {
    return state.orderMap;
  });

  const currPrice = useRef<string>(lastPrice);

  const [tradeType, setTradeType] = useState<OrderType>("LIMIT");
  const isLimit = tradeType === "LIMIT";
  const isMarket = tradeType === "MARKET";

  const { base, quote, uppercaseSymbol } = symbolMap;
  const [buyFormData, setBuyFormData] = useState<OrderRequest>(() =>
    createDefaultOrderRequest({
      side: "BUY",
      symbol: "",
      type: tradeType,
    })
  );

  const [sellFormData, setSellFormData] = useState<OrderRequest>(() =>
    createDefaultOrderRequest({
      side: "SELL",
      symbol: "",
      type: tradeType,
    })
  );

  useEffect(() => {
    currPrice.current = lastPrice;
  }, [lastPrice]);

  const buyFormRef = useRef<{ reset: () => void }>(null);
  const sellFormRef = useRef<{ reset: () => void }>(null);

  const [accountInfo, setAccountInfo] = useState<IAccountInfo>();

  const balances = accountInfo?.balances ?? [];

  const { maxBuyQty, quoteFree, maxSellAmount, baseFree } =
    useTradeAvailability(balances, base, quote);

  const getAccountInfoIn = async () => {
    const res = await getAccountInfo();
    if (res.success) {
      setAccountInfo(res.data);
    }
  };

  useEffect(() => {
    getAccountInfoIn();
  }, [base]);

  const resetForm = () => {
    buyFormRef.current?.reset();
    sellFormRef.current?.reset();
  };

  const tradeBtnClick = async (order: OrderRequest) => {
    const requestData = createDefaultOrderRequest({
      ...order,
      symbol: symbolMap.uppercaseSymbol,
      type: tradeType,
      price: isMarket ? 0 : Number(order.price),
      quantity: Number(order.quantity),
    });

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
      const actions = requestData.side === "BUY" ? buyFormRef : sellFormRef;
      actions.current?.reset();
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
            setFormData={setBuyFormData}
            formData={buyFormData}
            symbolMap={symbolMap}
            isMarket={isMarket}
            assets={quoteFree}
            lastPrice={lastPrice}
          ></ExForm>
          {/* 可用 */}
          <div className=" my-8px">
            <div className="flex justify-between">
              <p>可用</p>
              <p>
                {quoteFree} {quote}
              </p>
            </div>
            <div className="flex justify-between">
              <p>最大買入</p>
              <p>
                {maxBuyQty} {base}
              </p>
            </div>
            <div className="flex justify-between">
              <p>預估手續費</p>
              <p>0 {quote}</p>
            </div>
          </div>
          <Button
            colorScheme="blue"
            w="100%"
            onClick={() => tradeBtnClick(buyFormData)}
          >
            買入 {base}
          </Button>
        </div>
        {/* 賣出 */}
        <div className="w-full">
          <ExForm
            ref={sellFormRef}
            setFormData={setSellFormData}
            formData={sellFormData}
            symbolMap={symbolMap}
            isMarket={isMarket}
            assets={maxSellAmount}
            lastPrice={lastPrice}
          ></ExForm>
          {/* 可用 */}
          <div className="my-8px">
            <div className="flex justify-between">
              <p>可用</p>
              <p>
                {baseFree} {base}
              </p>
            </div>
            <div className="flex justify-between">
              <p>最大賣出</p>
              <p>
                {maxSellAmount} {quote}
              </p>
            </div>
            <div className="flex justify-between">
              <p>預估手續費</p>
              <p>0 {quote}</p>
            </div>
          </div>
          <Button
            colorScheme="red"
            w="100%"
            onClick={() => tradeBtnClick(sellFormData)}
          >
            賣出 {base}
          </Button>
        </div>
      </div>
    </div>
  );
}
