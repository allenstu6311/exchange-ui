import {
  SymbolInfoListTypes,
  SymbolInfoListState,
  SymbolNameMapType,
} from "./../types/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
      if (!action.payload) {
        console.error("symbolName與symbolInfoList名稱不匹配");
        return;
      }
    
      
      const newState = handleSymbolName(action.payload);
        console.log('newState',newState);
      return newState
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
    setSymbolInfoList(state, action: PayloadAction<SymbolInfoListTypes[]>) {
      state.list = action.payload;
    },
  },
});
