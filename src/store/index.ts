import { CurrentSymbolState } from "./../types/index";
import { Ticker24hrStat } from "@/types";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { symbolInfoList, symbolNameMap } from "@/store/symbol";

const initialState: CurrentSymbolState = {
  marketData: {} as Ticker24hrStat,
  exchangeSymbolMeta: [],
};

const currentSymbol = createSlice({
  name: "symbol",
  initialState,
  reducers: {
    setCurrMarketData: (state, action) => {
      state.marketData = action.payload.marketData;
    },
    setExchangeSymbolMeta: (state, action) => {
      state.exchangeSymbolMeta = action.payload.exchangeSymbolMeta;
    },
  },
});

// 讓state可以獲取slice的內容
const store = configureStore({
  reducer: {
    currentSymbol: currentSymbol.reducer,
    symbolInfoList: symbolInfoList.reducer,
    symbolNameMap: symbolNameMap.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { setCurrMarketData, setExchangeSymbolMeta } =
  currentSymbol.actions;

export const { setSymbolName } = symbolNameMap.actions;

export const { setSymbolInfoList } = symbolInfoList.actions;

export default store;
