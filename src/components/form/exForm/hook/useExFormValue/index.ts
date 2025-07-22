import { useCallback, useMemo, useState } from "react";
import { ExFormEnum, IExForm } from "../../types";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { validatePrecision } from "../useExFormValidate/utils"


export default function useExFormValue(){
    const [formData, setFormData] = useState<IExForm>({
        price: "",
        quantity: "",
        amount: "",
        slider: 0,
    })

    const { tradePrecision, showPrecision }: ISymbolInfoWithPrecision = useSelector(
        (state: RootState) => {
            return state.symbolInfoList.currentSymbolInfo;
        }
    );

    const updateField = useCallback((key: ExFormEnum, value: string) => {
        switch(key){
            case ExFormEnum.PRICE:
                if(!validatePrecision(value, showPrecision)) return;
                break;
            case ExFormEnum.QUANITY:
                if(!validatePrecision(value, tradePrecision)) return;
                break;
            default:
                break;
        }
        setFormData(prev => ({ ...prev, [key]: value }));        
      }, [showPrecision, tradePrecision]);

    const resetField = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            // price: "", // 目前只有交易完後會調用，不清除價錢對體驗比較好
            quantity: "",
            amount: "",
            slider: 0,
        })) ;
    }, []);

    return {
        formData,
        updateField,
        resetField,
    }
}