import { configureStore } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query/react';
import userReducer from './slices/userSlice';
import moodReducer from './slices/moodSlice';
import sleepReducer from './slices/sleepSlice';
import exerciseReducer from './slices/exerciseSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    mood: moodReducer,
    sleep: sleepReducer,
    exercise: exerciseReducer,
  },
});

// setupListeners(store.dispatch); // TODO: Enable when RTK Query is available

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;