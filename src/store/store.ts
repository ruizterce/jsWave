import { configureStore } from "@reduxjs/toolkit";
import isPlayingReducer from "./isPlayingSlice";
import stepCounterReducer from "./stepCounterSlice";

const store = configureStore({
  reducer: {
    isPlaying: isPlayingReducer,
    stepCounter: stepCounterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
