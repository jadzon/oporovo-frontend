// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import modalReducer from './slices/modalSlice';

// Check the reducer structure in your Redux DevTools
console.log("Setting up store with reducers:", { auth: authReducer, modal: modalReducer });

const store = configureStore({
    reducer: {
        auth: authReducer,
        modal: modalReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;