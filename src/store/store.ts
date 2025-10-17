// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from './usersApi';
import uiReducer from './uiSlice'; // Import the new reducer

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    ui: uiReducer, // Add the new UI slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
    }).concat(usersApi.middleware as any),
});

// Define RootState and AppDispatch types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;