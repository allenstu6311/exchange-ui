import { SymbolInfoListTypes } from "@/types";

export interface ISymbolInfoWithPrecision extends SymbolInfoListTypes {
  showPrecision: number;
  tradePrecision: number;
  tickSize: number;
}
