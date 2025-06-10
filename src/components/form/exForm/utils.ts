import { NumberString } from "@/types";
import { IFormValidate } from "./types";

export const validateEmpty = (value?: NumberString) => {
  if (!value) return false;
  return Number(value) > 0;
};

export const validatePricePrecision = (
  value?: NumberString,
  precision?: number
) => {
  if (!value || !precision) return false;
  if (typeof value === "number") {
    value = value.toString();
  }
  const lastDotIndex = value.lastIndexOf(".");
  const valueLength = value.length;
  if (lastDotIndex === -1) return true;
  return valueLength - lastDotIndex - 1 <= precision;
};

export const validateQuantityPrecision = (
  value?: NumberString,
  precision?: number
) => {};

export const validateInvalid = () => {};

export const validateForm: IFormValidate = {
  invalid: false,
  price: {
    invalid: false,
    empty: false,
    precision: false,
  },
  quantity: {
    invalid: false,
    empty: false,
    min: false,
  },
} as const;
