import { createSlice } from "@reduxjs/toolkit";
import { isString, TLoading, TUser } from "@types";
import actAddClientToHistory from "./act/actAddClientToHistory";
import actGetClients from "./act/actGetClients";

type THistoryState = {
  users: TUser[];
  loading: TLoading;
  error: string | null;
};

const initialState: THistoryState = {
  users: [],
  loading: "idle",
  error: null,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actGetClients.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetClients.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.users = action.payload;
      state.error = null;
    });
    builder.addCase(actGetClients.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    builder.addCase(actAddClientToHistory.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actAddClientToHistory.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actAddClientToHistory.rejected, (state, action) => {
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });
  },
});

export default historySlice.reducer;
