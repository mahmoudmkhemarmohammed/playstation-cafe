import { createSlice } from "@reduxjs/toolkit";
import { isString, TLoading, TOwner } from "@types";
import actAuthLogin from "./act/actAuthLogin";

type TAuthState = {
  user: TOwner | null;
  accessToken: string | null;
  loading: TLoading;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  accessToken: null,
  loading: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.accessToken = null;
      state.loading = "idle";
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(actAuthLogin.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actAuthLogin.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(actAuthLogin.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });
  },
});
export default authSlice.reducer;
export const {logOut} = authSlice.actions