import {
  SymbolInfoListTypes,
  SymbolInfoListState,
  SymbolNameMapType,
} from "./../types/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleFilters, handleSymbolName } from "./utils/symbol";
import { ISymbolInfoWithPrecision } from "@/hook/Market/types";

// const symbolNameMapState: SymbolNameMapType = {
//   base: "BTC",
//   quote: "USDT",
//   lowercaseSymbol: "btcusdt",
//   uppercaseSymbol: "BTCUSDT",
//   slashSymbol: "BTC/USDT",
// };
const symbolNameMapState: SymbolNameMapType = {
  base: "",
  quote: "",
  lowercaseSymbol: "",
  uppercaseSymbol: "",
  slashSymbol: "",
};

export const symbolNameMap = createSlice({
  name: "symbolNameMap",
  initialState: symbolNameMapState,
  reducers: {
    setSymbolName(
      state,
      action: PayloadAction<SymbolInfoListTypes | undefined>
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
    setSymbolInfoList(state, action: PayloadAction<SymbolInfoListTypes[]>) {
      state.list = handleFilters(action.payload);
    },
    setCurrSymbolInfo(state, action: PayloadAction<ISymbolInfoWithPrecision>) {
      state.currentSymbolInfo = action.payload;
    },
  },
});
