import { configureStore } from "@reduxjs/toolkit";
import { symbolInfoList, symbolNameMap } from "@/store/symbol";
import { ticker24hrData } from "./ticker";
import { orderMap } from "./order";
import { klineTimelyData } from "./kline";
import { loading } from "./common";

// 讓state可以獲取slice的內容
const store = configureStore({
  reducer: {
    symbolInfoList: symbolInfoList.reducer,
    symbolNameMap: symbolNameMap.reducer,
    ticker24hrData: ticker24hrData.reducer,
    orderMap: orderMap.reducer,
    klineTimelyData: klineTimelyData.reducer,
    loading: loading.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { setSymbolName } = symbolNameMap.actions;

export const { setSymbolInfoList, setCurrSymbolInfo } = symbolInfoList.actions;

export const { setTicker24hData, setTicker24hList, setCacheTicker24hData } = ticker24hrData.actions;

export const { setCurrentOrder } = orderMap.actions;

export const { setKlineTimelyData } = klineTimelyData.actions;

export const { setIsLoading } = loading.actions;

export default store;
