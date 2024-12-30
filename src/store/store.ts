import { configureStore } from "@reduxjs/toolkit";
import isPlayingReducer from "./isPlayingSlice";

const store = configureStore({
  reducer: {
    isPlaying: isPlayingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
