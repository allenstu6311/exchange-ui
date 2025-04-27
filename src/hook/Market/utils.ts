import { SymbolInfoListTypes, Ticker24hrStat } from "@/types";

export const handleTickerData = (
  newData: Ticker24hrStat[],
  oldData: Ticker24hrStat[]
): Ticker24hrStat[] => {
  return oldData.map((oldItem) => {
    const newItem = newData.find((item) => item.symbol === oldItem.symbol);

    if (newItem) {
      return {
        ...oldItem,
        ...newItem,
      };
    }
    return oldItem;
  });
};

export const getCurrentSymbolInfo = (
  symbolName: string,
  symbolInfoList: SymbolInfoListTypes[]
): SymbolInfoListTypes | undefined => {
  return symbolInfoList.find((item) => item.symbol === symbolName);
};
