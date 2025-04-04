import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import modalReducer from './slices/modalSlice';
import lessonsReducer from './slices/lessonsSlice';
import tutorsReducer from './slices/tutorsSlice';

console.log("Setting up store with reducers:", {
    auth: authReducer,
    modal: modalReducer,
    lessons: lessonsReducer,
    tutors: tutorsReducer,
});

const store = configureStore({
    reducer: {
        auth: authReducer,
        modal: modalReducer,
        lessons: lessonsReducer,
        tutors: tutorsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;