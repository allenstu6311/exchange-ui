import { CurrentSymbolState, ExchangeSymbolMeta } from "./../types/index";
import { Ticker24hrStat } from "@/types";
import { createSlice, configureStore } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    incremented: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decremented: (state) => {
      state.value -= 1;
    },
  },
});

const initialState: CurrentSymbolState = {
  symbol: "btcusdt",
  upperSymbol: "BTCUSDT",
  prettySymbol: "BTC/USDT",
  marketData: {} as Ticker24hrStat,
  exchangeSymbolMeta: [],
};

const currentSymbol = createSlice({
  name: "symbol",
  initialState,
  reducers: {
    setSymbol: (state, action) => {
      state.symbol = action.payload.symbol;
      state.upperSymbol = action.payload.symbol.toUpperCase();
    },
    setPrettySymbol: (state, action) => {
      state.prettySymbol = action.payload.prettySymbol;
    },
    setCurrMarketData: (state, action) => {
      state.marketData = action.payload.marketData;
    },
    setExchangeSymbolMeta: (state, action) => {
      state.exchangeSymbolMeta = action.payload.exchangeSymbolMeta;
    },
  },
});

const store = configureStore({
  reducer: {
    // counter: counterSlice.reducer,
    currentSymbol: currentSymbol.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const {
  setSymbol,
  setCurrMarketData,
  setExchangeSymbolMeta,
  setPrettySymbol,
} = currentSymbol.actions;

export default store;
