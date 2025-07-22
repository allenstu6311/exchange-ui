import { div, mul } from "@/utils";
import { ExFormEnum, IExForm, IPrecisionMap, UpdateFieldType } from "@/components/form/exForm/types";

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
  formData,
  precisionMap,
  updateField
}: {
  currPrice: string;
  value: string;
  formData: IExForm;
  precisionMap: IPrecisionMap;
  updateField: UpdateFieldType
}) {
  const { showPrecision, quoteAssetPrecision, tradePrecision } = precisionMap;

  if (currPrice && formData.quantity) {
    // 計算成交額 => 金額 * 數量
    const newAmount = mul(currPrice, formData.quantity, {
      precision: quoteAssetPrecision,
    });    
    updateField(ExFormEnum.AMOUNT, newAmount);
  } else if (formData.amount && currPrice) {
    // 計算數量 => 成交額 / 當前價格
    updateField(ExFormEnum.QUANITY, div(formData.amount, currPrice, { precision: tradePrecision }));
  } else {    
    updateField(ExFormEnum.AMOUNT, "");
  }
}

export function handleQuantityInput({
  currPrice,
  value,
  formData,
  precisionMap,
  updateField,
}: {
  currPrice: string;
  value: string;
  formData: IExForm;
  precisionMap: IPrecisionMap;
  updateField: UpdateFieldType
}) {
  const { quoteAssetPrecision } = precisionMap;
  if (currPrice && value) {
    const newAmount = mul(currPrice, value, { precision: quoteAssetPrecision });
    updateField(ExFormEnum.AMOUNT, newAmount);
  } else {
    updateField(ExFormEnum.AMOUNT, "");
  }
}

export function handleAmountInput({
  currPrice,
  value,
  formData,
  precisionMap,
  updateField,
}: {
  currPrice: string;
  value: string;
  formData: IExForm;
  precisionMap: IPrecisionMap;
  updateField: UpdateFieldType
}) {
  const { showPrecision, tradePrecision } = precisionMap;

  if (currPrice && value) {
    updateField(ExFormEnum.QUANITY, div(value, currPrice, {
      precision: tradePrecision,
    }));
  } else if (formData.quantity && value) {
    updateField(ExFormEnum.PRICE, div(value, formData.quantity, {
      precision: showPrecision,
    }));
  } else {
    updateField(ExFormEnum.QUANITY, "");
  }
  updateField(ExFormEnum.AMOUNT, value);
}

export function handleSilderInput({
  currPrice,
  value,
  assets,
  formData,
  precisionMap,
  updateField,
}: {
  currPrice: string;
  value: string;
  assets: number;
  formData: IExForm;
  precisionMap: IPrecisionMap;
  updateField: UpdateFieldType
}) {
  const { quoteAssetPrecision, tradePrecision } = precisionMap;
  const newAmount = div(mul(assets, value), 100, {
    precision: quoteAssetPrecision,
  });
  updateField(ExFormEnum.AMOUNT, newAmount);

  if (currPrice) {
    updateField(ExFormEnum.QUANITY, div(newAmount, currPrice, {
      precision: tradePrecision,
    }));
  }
}
