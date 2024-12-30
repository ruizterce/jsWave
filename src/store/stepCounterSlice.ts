import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StepCounterState {
  value: number;
}

const initialState: StepCounterState = {
  value: 0,
};

const stepCounterSlice = createSlice({
  name: "stepCounter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
      console.log("stepCounter: " + state.value);
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, reset, setValue } =
  stepCounterSlice.actions;
export default stepCounterSlice.reducer;
