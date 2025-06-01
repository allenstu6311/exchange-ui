import { IKlineData } from "@/hook/TradeView/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const klineMapState = {
  klineTimelyData: {},
};

export const klineTimelyData = createSlice({
  name: "klineTimelyData",
  initialState: klineMapState,
  reducers: {
    setKlineTimelyData(state, action: PayloadAction<IKlineData[]>) {
      state.klineTimelyData = action.payload;
    },
  },
});
