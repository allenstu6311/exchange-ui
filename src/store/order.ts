import { ICurrentOrder } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const orderMapState = {
    current: [] as ICurrentOrder[],
    history: []
}

export const orderMap = createSlice({
    name: 'orderMap',
    initialState: orderMapState,
    reducers:{
        setCurrentOrder(
            state,
            action: PayloadAction<ICurrentOrder[]>
        ){
            state.current = action.payload
        }
    }
})

