import { createAsyncThunk } from "@reduxjs/toolkit";
import { TUser } from "@types";
import axiosErrorHandler from "@utils/axiosErrorHandler";
import axios from "axios";

const actAddClientToHistory = createAsyncThunk(
  "history/actAddClientToHistory",
  async (user: TUser, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { deviceId, endTime, name, orders, price, startTime } = user;
    try {
      const res = await axios.post("/history", {
        deviceId,
        endTime,
        name,
        orders,
        price,
        startTime,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actAddClientToHistory;
