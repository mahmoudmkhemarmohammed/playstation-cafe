import { createSlice } from "@reduxjs/toolkit";
import actGetRevenues from "./act/actGetRevenues";
import { isString, TLoading } from "@types";
import actAddRevenues from "./act/actAddRevenues";
import actDeleteAllRevenues from "./act/actDeleteAllRevenues";

export type TRevenue = {
  id: number;
  date: string;
  total:number
};

type TState = {
  revenues: TRevenue[];
  loading: TLoading;
  error: string | null;
};

const initialState: TState = {
  revenues: [],
  loading: "idle",
  error: null,
};

const revenuesSlice = createSlice({
  name: "revenues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Revenues
    builder.addCase(actGetRevenues.pending, (state) => {
      state.loading = "idle";
      state.error = null;
    });
    builder.addCase(actGetRevenues.fulfilled, (state, action) => {
      state.revenues = action.payload;
      state.loading = "succeeded";
    });
    builder.addCase(actGetRevenues.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Add Revenues
    builder.addCase(actAddRevenues.pending, (state) => {
      state.loading = "idle";
      state.error = null;
    });
    builder.addCase(actAddRevenues.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actAddRevenues.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) state.error = action.payload;
    });

    // Delete All Revenues
    builder.addCase(actDeleteAllRevenues.pending, (state) => {
      state.loading = "idle";
      state.error = null;
    });
    builder.addCase(actDeleteAllRevenues.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actDeleteAllRevenues.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) state.error = action.payload;
    });
  },
});

export default revenuesSlice.reducer;
