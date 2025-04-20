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

const currentSymbol = createSlice({
  name: "symbol",
  initialState: {
    symbol: "BTCUSDT",
    lastPrice: 0,
    prevClosePrice: 0, // 判斷漲跌
  },
  reducers: {
    setSymbol: (state, action) => {
      state.symbol = action.payload.symbol;
    },
    setLastPrice: (state, action) => {
      state.lastPrice = action.payload.lastPrice;
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

export const { setSymbol, setLastPrice } = currentSymbol.actions;

export default store;
