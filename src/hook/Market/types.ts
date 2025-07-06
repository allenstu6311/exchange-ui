import { ISymbolInfoListTypes } from "@/types";

export interface ISymbolInfoWithPrecision extends ISymbolInfoListTypes {
  showPrecision: number;
  tradePrecision: number;
  tickSize: number;
  minNotional: number;
}
