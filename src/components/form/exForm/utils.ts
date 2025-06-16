import { div, mul } from "@/utils";
import { IExForm, IPrecisionMap } from "./types";

export function getCurrentPrice(
  formData: IExForm,
  lastPrice: string,
  isMarket: boolean
) {
  const limitPrice = formData.price || "";
  return isMarket ? lastPrice : limitPrice;
}

export function handlePriceInput({
  currPrice,
  value,
  amount,
  formData,
  precisionMap,
  setAmount,
}: {
  currPrice: string;
  value: string;
  amount: string;
  formData: IExForm;
  precisionMap: IPrecisionMap;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { showPrecision, quoteAssetPrecision, tradePrecision } = precisionMap;
  if (currPrice && formData.quantity) {
    // 計算成交額 => 金額 * 數量
    const newAmount = mul(currPrice, formData.quantity, {
      precision: quoteAssetPrecision,
    });
    setAmount(newAmount);
  } else if (amount && currPrice) {
    // 計算數量 => 成交額 / 當前價格
    formData.quantity = div(amount, currPrice, { precision: tradePrecision });
  } else {
    setAmount("");
  }
}

export function handleQuantityInput({
  currPrice,
  value,
  formData,
  precisionMap,
  setAmount,
}: {
  currPrice: string;
  value: string;
  formData: IExForm;
  precisionMap: IPrecisionMap;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { quoteAssetPrecision } = precisionMap;
  if (currPrice && value) {
    const newAmount = mul(currPrice, value, { precision: quoteAssetPrecision });
    setAmount(newAmount);
  } else {
    setAmount("");
  }
}

export function handleAmountInput({
  currPrice,
  value,
  formData,
  precisionMap,
  setAmount,
}: {
  currPrice: string;
  value: string;
  formData: IExForm;
  precisionMap: IPrecisionMap;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { showPrecision, tradePrecision } = precisionMap;

  if (currPrice && value) {
    formData.quantity = div(value, currPrice, {
      precision: tradePrecision,
    });
  } else if (formData.quantity && value) {
    formData.price = div(value, formData.quantity, {
      precision: showPrecision,
    });
  } else {
    formData.quantity = "";
  }
  setAmount(value);
}

export function handleSilderInput({
  currPrice,
  value,
  assets,
  formData,
  precisionMap,
  setAmount,
}: {
  currPrice: string;
  value: string;
  assets: number;
  formData: IExForm;
  precisionMap: IPrecisionMap;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { quoteAssetPrecision, tradePrecision } = precisionMap;
  const newAmount = div(mul(assets, value), 100, {
    precision: quoteAssetPrecision,
  });
  setAmount(newAmount);

  if (currPrice) {
    formData.quantity = div(newAmount, currPrice, {
      precision: tradePrecision,
    });
  }
}
