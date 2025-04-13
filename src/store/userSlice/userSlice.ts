import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, UserTypes } from "@/store/types";
import { RootState } from "@/store/store";

const initialState = {
    user: {
        id: "",
        name: "",
        email: "",
        image: "",
        emailVerified: false,
        isApproved: false,
        createdAt: null,
        updatedAt: null,
    },
    isAdmin: false,
    isLoading: true,
} as UserState

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserTypes>) => {
            state.user = action.payload;
            state.isAdmin = action.payload.id === process.env.NEXT_PUBLIC_ARMS_ADMIN_UID;
        },
        clearUser: (state) => {
            state.user = initialState.user;
            state.isAdmin = initialState.isAdmin;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
})

export const userActions = userSlice.actions;
export const SEL_User = (state: RootState) => state.user;

export const userReducer = userSlice.reducer;