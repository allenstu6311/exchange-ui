import { ISymbolInfoListTypes, ITicker24hrStatResponse } from "@/types";
import { ISymbolInfoWithPrecision } from "./types";

export const handleTickerData = (
  newData: ITicker24hrStatResponse[],
  oldData: ITicker24hrStatResponse[]
): ITicker24hrStatResponse[] => {
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
  symbolInfoList: ISymbolInfoWithPrecision[]
): ISymbolInfoWithPrecision | undefined => {
  return symbolInfoList.find((item) => item.symbol === symbolName);
};
