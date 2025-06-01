import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { SymbolInfoListTypes, SymbolNameMapType } from "@/types";
import { getDecimalPrecision } from "@/utils/calcaute";


const makePrettySymbol = (base: string, quote: string) => {
  return `${base}/${quote}`;
};

export const handleSymbolName = (
  currentSymbol: SymbolInfoListTypes
): SymbolNameMapType => {
  const { baseAsset, quoteAsset, symbol } = currentSymbol;
  return {
    base: baseAsset,
    quote: quoteAsset,
    lowercaseSymbol: symbol.toLocaleLowerCase(),
    uppercaseSymbol: symbol,
    slashSymbol: makePrettySymbol(baseAsset, quoteAsset),
  };
};

export const handleFilters = (symbolInfoList: SymbolInfoListTypes[]):ISymbolInfoWithPrecision[] => {
  return symbolInfoList.map((item:SymbolInfoListTypes)=>{
    const { filters } = item;
    let showPrecision = 0;
    let tradePrecision = 0;

    if(filters.length){
      showPrecision = getDecimalPrecision(filters[0].tickSize);
      tradePrecision = getDecimalPrecision(filters[1].stepSize)
    }
    return {
      ...item,
      showPrecision,
      tradePrecision
    }
  })
}