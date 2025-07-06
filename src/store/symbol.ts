import {
  ISymbolInfoListTypes,
} from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleFilters, handleSymbolName, makePrettySymbol } from "./utils/symbol";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";
import { ISymbolNameMapType } from "./utils/symbol";

interface SymbolInfoListState {
  list: ISymbolInfoWithPrecision[];
  currentSymbolInfo: ISymbolInfoWithPrecision;
}

const { pathname } = window.location;
const symbolName = pathname.replace('/','') || 'BTCUSDT'
const DEFAULT_QUOTE = 'USDT'

const symbolNameMapState: ISymbolNameMapType = {
  base: symbolName,
  quote: DEFAULT_QUOTE,
  lowercaseSymbol: symbolName.toLocaleLowerCase(),
  uppercaseSymbol: symbolName,
  slashSymbol: makePrettySymbol(symbolName, DEFAULT_QUOTE),
};

export const symbolNameMap = createSlice({
  name: "symbolNameMap",
  initialState: symbolNameMapState,
  reducers: {
    setSymbolName(
      state,
      action: PayloadAction<ISymbolInfoListTypes | undefined>
    ) {
      if (!action.payload) {
        console.error("symbolName與symbolInfoList名稱不匹配");
        return;
      }
      const newState = handleSymbolName(action.payload);
      return newState;
    },
  },
});

const symbolInfoListStatge: SymbolInfoListState = {
  list: [],
  currentSymbolInfo: {} as ISymbolInfoWithPrecision,
};

export const symbolInfoList = createSlice({
  name: "symbolInfoList",
  initialState: symbolInfoListStatge,
  reducers: {
    setSymbolInfoList(state, action: PayloadAction<ISymbolInfoListTypes[]>) {
      state.list = handleFilters(action.payload);
    },
    setCurrSymbolInfo(state, action: PayloadAction<ISymbolInfoWithPrecision>) {
      state.currentSymbolInfo = action.payload;
    },
  },
});
