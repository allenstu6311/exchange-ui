import { Ticker24hrDataStatMap, Ticker24hrStat } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const ticker24hrDataState: Ticker24hrDataStatMap = {
  map: {
    symbol: "", // 交易對，例如 "ETHBTC"
    priceChange: "", // 價格變化
    priceChangePercent: "", // 價格變化百分比
    weightedAvgPrice: "", // 加權平均價格
    prevClosePrice: "", // 昨日收盤價
    lastPrice: "", // 最新成交價
    lastQty: "", // 最新成交量
    bidPrice: "", // 當前最高買價
    bidQty: "", // 當前買單數量
    askPrice: "", // 當前最低賣價
    askQty: "", // 當前賣單數量
    openPrice: "", // 今日開盤價
    highPrice: "", // 24h 內最高價
    lowPrice: "", // 24h 內最低價
    volume: "", // 成交量（以 base 資產為單位）
    quoteVolume: "", // 成交量（以 quote 資產為單位）
    openTime: 0, // 24 小時內統計起始時間（毫秒 timestamp）
    closeTime: 0, // 24 小時內統計結束時間（毫秒 timestamp）
    firstId: 0, // 第一筆成交 ID
    lastId: 0, // 最後一筆成交 ID
    count: 0, // 成交筆數
  },
  list: [],
};

export const ticker24hrData = createSlice({
  name: "ticker24hrData",
  initialState: ticker24hrDataState,
  reducers: {
    setTicker24hData(state, action: PayloadAction<Ticker24hrStat>) {
      Object.assign(state.map, action.payload);
    },
    setTicker24hList(state, action: PayloadAction<Ticker24hrStat[]>) {
      // state.list = action.payload;
      Object.assign(state.list, action.payload);
    },
  },
});
