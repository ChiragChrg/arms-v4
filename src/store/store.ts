import { configureStore } from '@reduxjs/toolkit';
import {
    userReducer,
    loaderReducer,
    modalReducer,
    sidebarReducer,

    // API Slice Reducers
    authAPISlice,
    facultyAPISlice,
    dashboardAPISlice,
    institutionAPISlice,
    courseAPISlice,
    subjectAPISlice,
    unitAPISlice,
    documentAPISlice,
} from '@/store';

// Combine all reducers into a single root reducer
export const rootReducer = {
    user: userReducer,
    loader: loaderReducer,
    modal: modalReducer,
    sidebar: sidebarReducer,

    // API Slice Reducers
    [authAPISlice.reducerPath]: authAPISlice.reducer,
    [facultyAPISlice.reducerPath]: facultyAPISlice.reducer,
    [dashboardAPISlice.reducerPath]: dashboardAPISlice.reducer,
    [institutionAPISlice.reducerPath]: institutionAPISlice.reducer,
    [courseAPISlice.reducerPath]: courseAPISlice.reducer,
    [subjectAPISlice.reducerPath]: subjectAPISlice.reducer,
    [unitAPISlice.reducerPath]: unitAPISlice.reducer,
    [documentAPISlice.reducerPath]: documentAPISlice.reducer,
}

// Create the Redux store
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authAPISlice.middleware,
            facultyAPISlice.middleware,
            dashboardAPISlice.middleware,
            institutionAPISlice.middleware,
            courseAPISlice.middleware,
            subjectAPISlice.middleware,
            unitAPISlice.middleware,
            documentAPISlice.middleware
        ),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;