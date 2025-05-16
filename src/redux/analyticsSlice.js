import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetch",
  async ({ startDate, endDate }) => {
    const res = await axios.get(
      `http://go-dev.greedygame.com/v3/dummy/report?startDate=${startDate}&endDate=${endDate}`
    );
    return res.data.data;
  }
);

export const fetchApps = createAsyncThunk("apps/fetch", async () => {
  const res = await axios.get("http://go-dev.greedygame.com/v3/dummy/apps");
  return res.data.data;
});

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    data: [],
    apps: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchApps.fulfilled, (state, action) => {
        state.apps = action.payload;
      });
  },
});

export default analyticsSlice.reducer;
