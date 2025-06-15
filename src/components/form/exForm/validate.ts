import { NumberString } from "@/types";
import {
  ExFormEnum,
  IExForm,
  IExFormValidate,
  IPriceValidate,
  IQuanityValidate,
} from "./types";

export const validateEmpty = (value?: NumberString) => {
  if (!value) return false;
  return Number(value) > 0;
};

export const validatePrecision = (value?: NumberString, precision?: number) => {
  if (!value || !precision) return false;
  if (typeof value === "number") {
    value = value.toString();
  }
  const lastDotIndex = value.lastIndexOf(".");
  const valueLength = value.length;
  if (lastDotIndex === -1) return true;
  return valueLength - lastDotIndex - 1 <= precision;
};

export const validateMinQuantity = () => {};

export const validateMaxQuantity = (value: string, max: number): boolean => {
  if (!value || !max) return true;
  const numVal = Number(value);
  console.log("numVal", numVal, "max", max, "result", numVal <= max);

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
  setValidationMap,
}: {
  formData: IExForm;
  precision: number;
  maxVolume: number;
  setValidationMap: React.Dispatch<React.SetStateAction<IExFormValidate>>;
}) => {
  const emptyPass = validateEmpty(formData.quantity);
  const precisionPass = validatePrecision(formData.quantity, precision);
  const maxVolumePass = validateMaxQuantity(formData.quantity, maxVolume);

  const isVaild = emptyPass && precisionPass && maxVolumePass;
  setValidationMap((prev) => ({
    ...prev,
    quantity: {
      invalid: !isVaild,
      empty: emptyPass,
      max: maxVolumePass,
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
      if (!result.max) return `超出最多購買數量`;
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
  },
} as const;
