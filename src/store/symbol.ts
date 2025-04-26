import {
  SymbolInfoListTypes,
  SymbolInfoListState,
  SymbolNameMapType,
} from "./../types/index";
import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { handleSymbolName } from "./utils/symbol";

const symbolNameMapState: SymbolNameMapType = {
  base: "BTC",
  quote: "USDT",
  lowercaseSymbol: "btcusdt",
  uppercaseSymbol: "BTCUSDT",
  slashSymbol: "BTC/USDT",
};

export const symbolNameMap = createSlice({
  name: "symbolNameMap",
  initialState: symbolNameMapState,
  reducers: {
    setSymbolName(
      state,
      action: PayloadAction<SymbolInfoListTypes | undefined>
    ) {
      if (!action.payload) return;
      const newState = handleSymbolName(action.payload);
      Object.assign(state, newState);
    },
  },
});

const symbolInfoListStatge: SymbolInfoListState = {
  list: [],
};

export const symbolInfoList = createSlice({
  name: "symbolInfoList",
  initialState: symbolInfoListStatge,
  reducers: {
    setSymbolInfoList(state, action) {
      state.list = action.payload;
    },
  },
});
