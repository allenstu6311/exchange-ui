import { SymbolInfoListTypes, SymbolNameMapType } from "@/types";

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
