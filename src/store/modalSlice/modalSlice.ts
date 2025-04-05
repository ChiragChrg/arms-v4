import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    showModal: null
} as { showModal: string | null };

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        show: (state, action: PayloadAction<string>) => {
            state.showModal = action.payload;
        },
        close: (state) => {
            state.showModal = null;
        },
    },
})

export const modalActions = modalSlice.actions;
export const SEL_showModal = (state: { modal: { showModal: string | null } }) => state.modal;

export const modalReducer = modalSlice.reducer;