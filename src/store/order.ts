import { ICurrentOrderResponse } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const orderMapState = {
    current: [] as ICurrentOrderResponse[],
    history: []
}

export const orderMap = createSlice({
    name: 'orderMap',
    initialState: orderMapState,
    reducers:{
        setCurrentOrder(
            state,
            action: PayloadAction<ICurrentOrderResponse[]>
        ){
            state.current = action.payload
        }
    }
})

