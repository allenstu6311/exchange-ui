import { RootState } from "@/store";
import { ExFormEnum, IExForm } from "../../types";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import { getCurrentPrice, handleAmountInput, handlePriceInput, handleQuantityInput, handleSilderInput } from "./utils";
import { div, mul } from "@/utils";


export default function useExFormCalculation(
    { 
        formData,
        isMarket,
        updateField,
        assets
    }: {
        formData: IExForm,
        isMarket: boolean,
        updateField: (key: ExFormEnum, value: string) => void,
        assets: number,
    }
) {
    const { showPrecision, tradePrecision, quoteAssetPrecision }: ISymbolInfoWithPrecision = useSelector(
        (state: RootState) => {
            return state.symbolInfoList.currentSymbolInfo;
        }
    );

    const { lastPrice = "0" } = useSelector((state: RootState) => {
        return state.ticker24hrData.cacheMap;
    });

    const precisionMap = useMemo(() => {
        return {
            showPrecision,
            tradePrecision,
            quoteAssetPrecision,
        }
    }, [showPrecision, tradePrecision, quoteAssetPrecision])

    const calculateSlider = useCallback((assets: number, amount: string) => {
        if (assets && amount) {
            const percent = div(amount, assets, { precision: 3 });
            updateField(ExFormEnum.SLIDER, mul(percent, 100, { precision: 2 }));
        }
    }, [updateField])

    const calculateEffect = useCallback((key: ExFormEnum, value: string) => {
        const currPrice = getCurrentPrice(formData, lastPrice, isMarket);
        let amount = formData.amount;
        switch (key) {
            case ExFormEnum.PRICE:
                handlePriceInput({
                    currPrice,
                    value,
                    formData,
                    precisionMap,
                    updateField
                })
                break;
            case ExFormEnum.QUANITY:
                handleQuantityInput({
                    currPrice,
                    value,
                    formData,
                    precisionMap,
                    updateField
                })
                break;
            case ExFormEnum.AMOUNT:
                handleAmountInput({
                    currPrice,
                    value,
                    formData,
                    precisionMap,
                    updateField,
                })
                amount = value;
                break;
            case ExFormEnum.SLIDER:
                handleSilderInput({
                    currPrice,
                    value,
                    assets,
                    formData,
                    precisionMap,
                    updateField,
                })
                break;
        }

        if(key !== ExFormEnum.SLIDER) {
            calculateSlider(assets, amount);
        }

    }, [formData, isMarket, precisionMap, lastPrice, updateField, calculateSlider, assets])

    return {
        calculateEffect
    }
}