import { createSlice } from "@reduxjs/toolkit";

export const displayModeSlice = createSlice({
  name: "displayMode",
  initialState: {
    info: {
      darkMode: false,
    },
  },
  reducers: {
    setDisplayMode: (state, action) => {
      state.info = action.payload;
    },
    removeDisplayMode: (state) => {
      state.info = {
        darkMode: false,
      };
    },
  },
});

export const { setDisplayMode, removeDisplayMode } = displayModeSlice.actions;
export default displayModeSlice.reducer;
export const selectDisplayMode = (state: any) => state.displayMode.info;
