import { NumberString } from "@/types";
import {
  ExFormEnum,
  IExForm,
  IExFormValidate,
  IPriceValidate,
  IQuanityValidate,
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
  precision,
  maxVolume,
  minNotional,
  setValidationMap,
}: {
  formData: IExForm;
  precision: number;
  maxVolume: number;
  minNotional: number;
  setValidationMap: React.Dispatch<React.SetStateAction<IExFormValidate>>;
}) => {
  const { price, quantity } = formData;
  const emptyPass = validateEmpty(quantity);
  // const precisionPass = validatePrecision(quantity, precision);
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

export function getErrorMsg(type: ExFormEnum, validateResult: any): string {
  if (!validateResult.invalid) return "";

  switch (type) {
    case ExFormEnum.PRICE: {
      const result = validateResult as IPriceValidate;
      if (!result.empty) return `尚未填價錢`;
      else return "";
    }

    case ExFormEnum.QUANITY: {
      const result = validateResult as IQuanityValidate;
      console.log("result", result);

      if (!result.max) return `超出最多購買數量`;
      if (!result.min) return `尚未滿足最少購買數量`;
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
