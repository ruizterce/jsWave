import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StepCounterState {
  value: number;
  length: number;
}

const initialState: StepCounterState = {
  value: 0,
  length: 8,
};

const stepCounterSlice = createSlice({
  name: "stepCounter",
  initialState,
  reducers: {
    increment: (state) => {
      if (state.value === state.length) {
        state.value = 1;
      } else {
        state.value += 1;
      }
      console.log("stepCounter: " + state.value);
    },
    decrement: (state) => {
      if (state.value === 1) {
        state.value = state.length;
      } else {
        state.value -= 1;
      }
      console.log("stepCounter: " + state.value);
    },
    reset: (state) => {
      state.value = 0;
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    setLength: (state, action: PayloadAction<number>) => {
      state.length = action.payload;
      console.log("state.length = " + state.length);
    },
  },
});

export const { increment, decrement, reset, setValue, setLength } =
  stepCounterSlice.actions;
export default stepCounterSlice.reducer;
