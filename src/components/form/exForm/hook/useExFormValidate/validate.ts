import { validateEmpty, validateMaxQuantity, validateMinQuantity, validatePrecision } from "./utils";

// 驗證價錢
export const validatePrice = ({
    price,
}: {
    price: string;
    // precision: number;
}) => {
    const emptyPass = validateEmpty(price);
    // const precisionPass = validatePrecision(price, precision);

    return {
        isValid: emptyPass,
        empty: emptyPass,
        // precision: precisionPass,
    }
};

// 驗證數量
export const validateQuantity = ({
    price,
    quantity,
    maxVolume,
    minNotional,
}: {
    price: string;
    quantity: string;
    maxVolume: number;
    minNotional: number;
}) => {
    const emptyPass = validateEmpty(quantity);
    const minPicePass = validateMinQuantity(price, quantity, minNotional);
    const maxVolumePass = validateMaxQuantity(quantity, maxVolume);

    return {
        isValid: emptyPass && maxVolumePass && minPicePass,
        empty: emptyPass,
        max: maxVolumePass,
        min: minPicePass,
    }
};