import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

const initialState = {
    showLoader: true
}

const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers: {
        setShowLoader: (state, action: PayloadAction<boolean>) => {
            state.showLoader = action.payload;
        },
    },
});

export const loaderActions = loaderSlice.actions;
export const SEL_ShowLoader = (state: RootState) => state.loader;

export const loaderReducer = loaderSlice.reducer;