import { createSlice } from "@reduxjs/toolkit";

interface IsPlayingState {
  value: boolean;
}

const initialState: IsPlayingState = {
  value: false,
};

const isPlayingSlice = createSlice({
  name: "isPlaying",
  initialState,
  reducers: {
    play: (state) => {
      state.value = true;
    },
    stop: (state) => {
      state.value = false;
    },
  },
});

export const { play, stop } = isPlayingSlice.actions;
export default isPlayingSlice.reducer;
