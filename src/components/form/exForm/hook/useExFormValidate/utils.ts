import { NumberString } from "@/types";
import { mul } from "@/utils";

export const validateEmpty = (value?: NumberString) => {
    if (!value) return false;
    return Number(value) > 0;
};

export const validatePrecision = (value: NumberString, precision: number) => {
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