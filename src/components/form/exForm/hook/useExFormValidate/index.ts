import { useState } from "react";
import { ExFormEnum, IExForm, IExFormValidate, IQuanityValidate, ValidateInputType } from "@/components/form/exForm/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { OrderSide } from "@/types";
import { validatePrice, validateQuantity } from "./validate";

export default function useExFormValidate(formData: IExForm, maxVolume: number) {
    const { tradePrecision, minNotional }: ISymbolInfoWithPrecision = useSelector(
        (state: RootState) => {
            return state.symbolInfoList.currentSymbolInfo;
        }
    );
    const [validationMap, setValidationMap] = useState<IExFormValidate>({
        invalid: false,
        price: {
            invalid: false,
            empty: false,
        },
        quantity: {
            invalid: false,
            empty: false,
            max: false,
            min: false,
        },
    });

    /**
     * 未來悠化成useForm組件再抽出
     */
    function getErrorMsg(
        type: ExFormEnum,
        validateResult: ValidateInputType,
        meta: Record<string, string | number> = {}
    ): string {
        if (!validateResult.invalid) return "";

        switch (type) {
            case ExFormEnum.PRICE: {
                const result = validateResult;
                if (!result.empty) return `尚未填價錢`;
                else return "";
            }

            case ExFormEnum.QUANITY: {
                const result = validateResult as IQuanityValidate;
                const { maxVolume, quote, side, assets } = meta;
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
    
    const validateInput = (key: ExFormEnum, value: string) => {
        const validators = {
            [ExFormEnum.PRICE]: validatePriceInput,
            [ExFormEnum.QUANITY]: validateQuantityInput,
            [ExFormEnum.AMOUNT]: () => false,
            [ExFormEnum.SLIDER]: () => false,
          };
        
        const validator = validators[key];
        if (validator) {
          validator(value);
        }
      };

    const validatePriceInput = (value: string) => {
        const result = validatePrice({
            price: value,
        })
        setValidationMap((prev) => ({
            ...prev,
            price: {
                invalid: !result.isValid,
                ...result,
            },
        }))
        return result.isValid;
    }

    const validateQuantityInput = (value: string) => {
        const result = validateQuantity({
            price: formData.price,
            quantity: value,
            maxVolume: maxVolume,
            minNotional: minNotional,
        });
        setValidationMap((prev) => ({
            ...prev,
            quantity: {
                invalid: !result.isValid,
                ...result,
            },
        }))
        return result.isValid;
    }

    const validateAll = (): boolean => { 
        const { price, quantity } = formData;
        const priceResult = validatePriceInput(price);
        const quantityResult = validateQuantityInput(quantity);
        return priceResult && quantityResult
    }


    return {
        validationMap,
        getErrorMsg,
        validateAll,
        validateInput
    }
}