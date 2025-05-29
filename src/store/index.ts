import { configureStore } from "@reduxjs/toolkit";
import { symbolInfoList, symbolNameMap } from "@/store/symbol";
import { ticker24hrData } from "./ticker";
import { orderMap } from "./order";
import { klineTimelyData } from "./kline";

// 讓state可以獲取slice的內容
const dispatch = configureStore({
  reducer: {
    symbolInfoList: symbolInfoList.reducer,
    symbolNameMap: symbolNameMap.reducer,
    ticker24hrData: ticker24hrData.reducer,
    orderMap: orderMap.reducer,
    klineTimelyData: klineTimelyData.reducer,
  },
});

export type RootState = ReturnType<typeof dispatch.getState>;
export type AppDispatch = typeof dispatch.dispatch;

export const { setSymbolName } = symbolNameMap.actions;

export const { setSymbolInfoList, setCurrSymbolInfo } = symbolInfoList.actions;

export const { setTicker24hData, setTicker24hList } = ticker24hrData.actions;

export const { setCurrentOrder } = orderMap.actions;

export const { setKlineTimelyData } = klineTimelyData.actions;

export default dispatch;
