import { configureStore } from "@reduxjs/toolkit";
import analyticsReducer from "./analyticsSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    ui: uiReducer,
  },
});
