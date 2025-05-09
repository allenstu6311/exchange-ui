import { createOrder, getAccountInfo } from "@/api/service/exchange";
import { IAccountInfo, OrderRequest, OrderSide, OrderType } from "@/types";
import { useEffect, useState } from "react";
import classNames from "classnames";
import ExForm from "@/components/form/exForm";
import { Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { createDefaultOrderRequest } from "@/hook/TradeForm/utils";
import { useTradeAvailability } from "@/hook/TradeForm";

export default function TradeForm() {
  const symbolMap = useSelector((state: RootState) => {
    return state.symbolNameMap;
  });

  const lastPrice = useSelector((state: RootState) => {
    return state.ticker24hrData.map.lastPrice;
  });

  const [tradeType, setTradeType] = useState<OrderType>("LIMIT");
  const isLimit = tradeType === "LIMIT";
  const isMarket = tradeType === "MARKET";

  const { base, quote } = symbolMap;
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

  const [accountInfo, setAccountInfo] = useState<IAccountInfo>();

  const balances = accountInfo?.balances ?? [];

  const { maxBuyQty, quoteFree, maxSellQty, baseFree } = useTradeAvailability(
    balances,
    base,
    quote,
    lastPrice
  );

  useEffect(() => {
    const getAccountInfoIn = async () => {
      const accountInfo = await getAccountInfo();
      if (accountInfo) {
        setAccountInfo(accountInfo);
      }
    };
    getAccountInfoIn();
  }, [base]);

  const tradeBtnClick = async (order: OrderRequest) => {
    const requestData = createDefaultOrderRequest({
      ...order,
      symbol: symbolMap.uppercaseSymbol,
      type: tradeType,
    });
    await createOrder(requestData);
    const actions =
      requestData.side === "BUY" ? setBuyFormData : setSellFormData;
    actions((prev: OrderRequest) => ({
      ...prev,
      price: "",
      quantity: "",
      quoteOrderQty: "",
    }));
  };

  return (
    <div className="p-16px">
      {/* tab */}
      <div className="flex gap-16px mb-16px">
        <span
          className={classNames("cursor-pointer text-#B7BDC6", {
            "text-black": isLimit,
          })}
          onClick={() => {
            setTradeType("LIMIT");
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
          }}
        >
          市價
        </span>
      </div>
      {/* form */}
      <div className="flex gap-16px">
        {/* 買入 */}
        <div className="w-full">
          <ExForm
            setFormData={setBuyFormData}
            formData={buyFormData}
            base={base}
            quote={quote}
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
            setFormData={setSellFormData}
            formData={sellFormData}
            base={base}
            quote={quote}
          ></ExForm>
          {/* 可用 */}
          <div className=" my-8px">
            <div className="flex justify-between">
              <p>可用</p>
              <p>
                {baseFree} {base}
              </p>
            </div>
            <div className="flex justify-between">
              <p>最大賣出</p>
              <p>
                {maxSellQty} {quote}
              </p>
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
