import { configureStore } from '@reduxjs/toolkit';
import { loaderReducer, modalReducer, sidebarReducer, userReducer } from '@/store';

export const rootReducer = {
    user: userReducer,
    loader: loaderReducer,
    modal: modalReducer,
    sidebar: sidebarReducer,
}

const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;