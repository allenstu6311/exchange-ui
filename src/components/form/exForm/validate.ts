import { NumberString, OrderSide } from "@/types";
import {
  ExFormEnum,
  IExForm,
  IExFormValidate,
  IPriceValidate,
  IQuanityValidate,
  ValidateExFormItem,
} from "./types";
import { mul } from "@/utils";

export const validateEmpty = (value?: NumberString) => {
  if (!value) return false;
  return Number(value) > 0;
};

export const validatePrecision = (value?: NumberString, precision?: number) => {
  if (!value || !precision) return true;
  if (typeof value === "number") {
    value = value.toString();
  }
  const lastDotIndex = value.lastIndexOf(".");
  const valueLength = value.length;
  if (lastDotIndex === -1) return true;
  return valueLength - lastDotIndex - 1 <= precision;
};

export const validateMinQuantity = (
  price: string,
  quantity: string,
  min: number
) => {
  if (!price || !quantity || !min) return true;
  const currPrice = mul<number>(price, quantity, { returnNumber: true });
  return currPrice >= min;
};

export const validateMaxQuantity = (value: string, max: number): boolean => {
  if (!value || !max) return true;
  const numVal = Number(value);
  return numVal <= max;
};

// 驗證價錢
export const validatePriceInput = ({
  formData,
  precision,
  setValidationMap,
}: {
  formData: IExForm;
  precision: number;
  setValidationMap: React.Dispatch<React.SetStateAction<IExFormValidate>>;
}) => {
  const emptyPass = validateEmpty(formData.price);
  const precisionPass = validatePrecision(formData.price, precision);
  const isVaild = emptyPass && precisionPass;
  setValidationMap((prev) => ({
    ...prev,
    price: {
      invalid: !isVaild,
      empty: emptyPass,
      precision: precisionPass,
    },
  }));
  return isVaild;
};

// 驗證數量
export const validateQuantityInput = ({
  formData,
  maxVolume,
  minNotional,
  setValidationMap,
}: {
  formData: IExForm;
  maxVolume: number;
  minNotional: number;
  setValidationMap: React.Dispatch<React.SetStateAction<IExFormValidate>>;
}) => {
  const { price, quantity } = formData;
  const emptyPass = validateEmpty(quantity);
  const minPicePass = validateMinQuantity(price, quantity, minNotional);
  const maxVolumePass = validateMaxQuantity(quantity, maxVolume);
  const isVaild = emptyPass && maxVolumePass && minPicePass;
  setValidationMap((prev) => ({
    ...prev,
    quantity: {
      invalid: !isVaild,
      empty: emptyPass,
      max: maxVolumePass,
      min: minPicePass,
    },
  }));
  return isVaild;
};

export function getErrorMsg(
  type: ExFormEnum,
  validateResult: ValidateExFormItem,
  meta: Record<string, string | number> = {}
): string {
  if (!validateResult.invalid) return "";

  switch (type) {
    case ExFormEnum.PRICE: {
      const result = validateResult as IPriceValidate;
      if (!result.empty) return `尚未填價錢`;
      else return "";
    }

    case ExFormEnum.QUANITY: {
      const result = validateResult as IQuanityValidate;
      const { maxVolume, minNotional, quote, side, assets } = meta;
      const isBuy = side === OrderSide.BUY;
      const isSell = side === OrderSide.SELL;

      if (isBuy && !result.max) return `最多購買${maxVolume}`;
      if (isBuy && !result.min) return `最少須購買${minNotional} ${quote}`;
      if (isSell && !result.max) return `最多賣出${assets} ${quote}`;
      if (isSell && !result.min) return `最少須賣出${minNotional} ${quote}`;
      if (!result.empty) return `尚未填數量`;
      else return "";
    }
  }

  return "";
}

export const validateForm: IExFormValidate = {
  invalid: false,
  price: {
    invalid: false,
    empty: false,
    precision: false,
  },
  quantity: {
    invalid: false,
    empty: false,
    max: false,
    min: false,
  },
} as const;
