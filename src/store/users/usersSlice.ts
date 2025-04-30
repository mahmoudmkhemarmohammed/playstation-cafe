import { createSlice } from "@reduxjs/toolkit";
import { isString, TLoading, TUser } from "@types";
import actGetUsers from "./act/actGetUsers";
import actAddClient from "./act/actAddClient";
import actAddExtraTime from "./act/actAddExtraTime";
import actAddOrderToClient from "./act/actAddOrders";
import actRemoveClient from "./act/actRemoveClient";
import actGetClientByDeviceId from "./act/actGetClientByDeviceId";

type TUsersState = {
  loading: TLoading;
  data: TUser[];
  error: string | null;
};

const initialState: TUsersState = {
  loading: "idle",
  data: [],
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    cleanUpUsers: (state) => {
      state.data = [];
      state.error = null;
      state.loading = "idle";
    },
  },
  extraReducers: (builder) => {
    // Get All Users
    builder.addCase(actGetUsers.pending, (state) => {
      state.loading = "idle";
      state.error = null;
    });
    builder.addCase(actGetUsers.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(actGetUsers.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Get User By DeviceId
    builder.addCase(actGetClientByDeviceId.pending, (state) => {
      state.loading = "idle";
      state.error = null;
    });
    builder.addCase(actGetClientByDeviceId.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(actGetClientByDeviceId.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Add User
    builder.addCase(actAddClient.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actAddClient.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actAddClient.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Add Extra Time
    builder.addCase(actAddExtraTime.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actAddExtraTime.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actAddExtraTime.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Add Order
    builder.addCase(actAddOrderToClient.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actAddOrderToClient.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actAddOrderToClient.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // Remove Client
    builder.addCase(actRemoveClient.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actRemoveClient.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
    });
    builder.addCase(actRemoveClient.rejected, (state, action) => {
      state.loading = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });
  },
});

export default usersSlice.reducer;
export const { cleanUpUsers } = usersSlice.actions;
