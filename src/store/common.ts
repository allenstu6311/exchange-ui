import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const loading = createSlice({
    name: 'loading',
    initialState: {
        isLoading: false
    },
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        }
    }
})