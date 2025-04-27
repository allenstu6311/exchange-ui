import { configureStore } from "@reduxjs/toolkit";
import { symbolInfoList, symbolNameMap } from "@/store/symbol";
import { ticker24hrData } from "./ticker";

// 讓state可以獲取slice的內容
const dispatch = configureStore({
  reducer: {
    symbolInfoList: symbolInfoList.reducer,
    symbolNameMap: symbolNameMap.reducer,
    ticker24hrData: ticker24hrData.reducer,
  },
});

export type RootState = ReturnType<typeof dispatch.getState>;
export type AppDispatch = typeof dispatch.dispatch;

export const { setSymbolName } = symbolNameMap.actions;

export const { setSymbolInfoList } = symbolInfoList.actions;

export const { setTicker24hData } = ticker24hrData.actions;

export default dispatch;
