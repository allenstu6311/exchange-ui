import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { ISymbolInfoListTypes } from "@/types";
import { getDecimalPrecision } from "@/utils/calcaute";

export interface ISymbolNameMapType {
  base: string;
  quote: string;
  lowercaseSymbol: string;
  uppercaseSymbol: string;
  /**
   * BTC/USDT
   */
  slashSymbol: string;
}

export const makePrettySymbol = (base: string, quote: string) => {
  return `${base}/${quote}`;
};

export const handleSymbolName = (
  currentSymbol: ISymbolInfoListTypes
): ISymbolNameMapType => {
  const { baseAsset, quoteAsset = "USDT", symbol } = currentSymbol;
  return {
    base: baseAsset,
    quote: quoteAsset,
    lowercaseSymbol: symbol.toLocaleLowerCase(),
    uppercaseSymbol: symbol,
    slashSymbol: makePrettySymbol(baseAsset, quoteAsset),
  };
};

export const handleFilters = (
  symbolInfoList: ISymbolInfoListTypes[]
): ISymbolInfoWithPrecision[] => {
  return symbolInfoList.map((item: ISymbolInfoListTypes) => {
    const { filters } = item;
    let showPrecision = 0;
    let tradePrecision = 0;
    let tickSize = 0;
    let minNotional = 0;

    if (filters.length) {
      showPrecision = getDecimalPrecision(filters[0].tickSize); // PRICE_FILTER
      tradePrecision = getDecimalPrecision(filters[1].stepSize); //LOT_SIZE
      tickSize = parseFloat(filters[0].tickSize);
      minNotional = parseFloat(filters[6].minNotional); //NOTIONAL
    }
    return {
      ...item,
      showPrecision,
      tradePrecision,
      tickSize,
      minNotional,
    };
  });
};
