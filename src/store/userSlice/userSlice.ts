import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, UserTypes } from "@/store/types";
import { RootState } from "@/store/store";

const initialState = {
    userData: {
        id: "",
        name: "",
        email: "",
        image: null,
        emailVerified: false,
        isApproved: false,
        createdAt: null,
        updatedAt: null,
        accessToken: "",
    },
    isAdmin: false,
    isLoading: true,
} as UserState

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserTypes>) => {
            state.userData = action.payload;
            state.isAdmin = action.payload.id === process.env.NEXT_PUBLIC_ARMS_ADMIN_UID;
        },
        clearUser: (state) => {
            state.userData = initialState.userData;
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