import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    showSidebar: true
}

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        setShowSidebar: (state, action: PayloadAction<boolean>) => {
            state.showSidebar = action.payload;
        },
    },
});

export const sidebarActions = sidebarSlice.actions;
export const SEL_ShowSidebar = (state: { sidebar: { showSidebar: boolean } }) => state.sidebar;

export const sidebarReducer = sidebarSlice.reducer;